// Models
var Search = require('./models/search');
var User = require('./models/user');

// Libraries
var fs = require('fs');
var request = require('request');
var google = require('googleapis');
var calendar = google.calendar('v3');
var plus = google.plus('v1');

// Read config data from file
var obj = JSON.parse(fs.readFileSync('app/config.json', 'utf8'));
var client_id = obj.google.client_id;
var client_secret = obj.google.client_secret;
var redirect_url = obj.google.redirect_url;
var eventbriteToken = obj.eventbrite.token;

// New OAuth object
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
    client_id,
    client_secret,
    redirect_url
);

var googleTokens;

module.exports = function (app) {

    // Search Eventbrite API
    app.get('/api/search', function (req, res) {
        // Get search parameters
        var searchQuery = req.headers.query.toLowerCase().trim();
        var searchLocation = req.headers.location.toLowerCase().trim();
        var searchCategory = req.headers.category.toLowerCase().trim();

        // Create object to save search parameters and results to database
        var searchData = new Search();

        // Get the integer ID of the search category
        var categoryId = searchData.getCategoryId(searchCategory);

        // Check database to see if any previous searches match the current search
        Search.find({
            query: searchQuery,
            location: searchLocation,
            category: searchCategory
        }, function (error, searches) {
            if (error) return console.error(error);
            // Check if any matches in database
            if (searches.length > 0) {
                console.log('Found match');
                // Return the results of that match
                res.send(JSON.parse(searches[0].results));
            } else {
                // There were no matches
                console.log('Searching Eventbrite');

                // HTTP Request to Eventbrite API
                var options = {
                    method: 'GET',
                    url: 'https://www.eventbriteapi.com/v3/events/search/',
                    qs: {
                        q: searchQuery,
                        sort_by: 'date',
                        'location.address': searchLocation,
                        categories: categoryId,
                        token: eventbriteToken
                    }
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    // Save search results to database
                    searchData.query = searchQuery;
                    searchData.location = searchLocation;
                    searchData.category = searchCategory;
                    searchData.results = JSON.stringify(body);
                    searchData.save();

                    // Return search results
                    res.send(body);
                });
            }
        });
    });

    app.get('/api/search-from-calendar', function (req, res) {
        // Get search parameters
        var searchStart = req.headers.start;
        var searchEnd = req.headers.end;

        // HTTP Request to Eventbrite API
        var options = {
            method: 'GET',
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            qs: {
                //q: 'fun',
                sort_by: 'date',
                'location.address': 'Boston',
                categories: '103',
                'start_date.range_start': searchStart,
                'start_date.range_end': searchEnd,
                token: eventbriteToken
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            // Return search results
            res.send(body);
        });
    });

    // Send URL to redirect to Google Sign In
    app.get('/api/google/auth/code', function (req, res) {
        // Need Calendar to modify user's Google Calendar
        // Need Google+ to keep track of individual users
        var scopes = [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/calendar'
        ];
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        res.send(url);
    });

    // Get Google OAuth Token
    app.get('/api/google/auth/token', function (req, res) {
        var code = req.headers.code.trim().replace('%2F', '/'); // This is what was causing it to not work
        if (code === null) {
            res.send('');
            return;
        }
        // Get Google token
        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log(err);
                res.send(err);
                return;
            }
            // Authenticate with Google+
            oauth2Client.setCredentials(tokens);
            plus.people.get({
                userId: 'me',
                auth: oauth2Client
            }, function (err, user) {
                if (err) {
                    console.log('The Google+ API returned an error: ' + err);
                    res.send(err);
                    return;
                }
                // Save Google AccountID as a new User in database
                var userData = new User();
                userData.id = user.id;
                userData.save();
            });
            // Return Google tokens
            googleTokens = tokens;
            res.send(tokens);
        })
    });

    app.get('/api/google/events', function (req, res) {
        oauth2Client.setCredentials(googleTokens);
        console.log(req.headers.start);
        calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            timeMin: req.headers.start,//(new Date()).toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        }, function (err, response) {
            if (err) {
                console.log('The Calendar API returned an error: ' + err);
                res.send([]);
                return;
            }
            var events = response.items;
            console.log(events);
            res.send(events);
        });
    });

    app.get('/api/google/insert', function (req, res) {
        var summary = req.headers.summary;
        var location = req.headers.location;
        var description = req.headers.description;
        var dateTimeStart = req.headers.start;
        var dateTimeEnd = req.headers.end;
        var timeZone = req.headers.timezone;
        var event = {
            'summary': summary,
            'location': location,
            'description': description,
            'start': {
                'dateTime': dateTimeStart,
                'timeZone': timeZone
            },
            'end': {
                'dateTime': dateTimeEnd,
                'timeZone': timeZone
            }
        };
        oauth2Client.setCredentials(googleTokens);
        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                res.send(err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
            res.send(event.htmlLink);
        })
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};