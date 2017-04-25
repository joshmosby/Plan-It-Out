var Search = require('./models/search');
var fs = require('fs');
var request = require('request');
var google = require('googleapis');
var calendar = google.calendar('v3');
var plus = google.plus('v1');


module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
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

                // Read token from file
                var obj = JSON.parse(fs.readFileSync('app/config.json', 'utf8'));
                var token = obj.eventbrite.token;

                // HTTP Request to Eventbrite API
                var options = {
                    method: 'GET',
                    url: 'https://www.eventbriteapi.com/v3/events/search/',
                    qs: {
                        q: searchQuery,
                        sort_by: 'date',
                        'location.address': searchLocation,
                        categories: categoryId,
                        token: token
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

    var OAuth2 = google.auth.OAuth2;

    // Read google config data from file
    var obj = JSON.parse(fs.readFileSync('app/config.json', 'utf8'));
    var client_id = obj.google.client_id;
    var client_secret = obj.google.client_secret;
    var redirect_url = obj.google.redirect_url;

    var oauth2Client = new OAuth2(
        client_id,
        client_secret,
        redirect_url
    );

    var scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/calendar'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    var googleTokens;

    app.get('/api/auth/google/code', function (req, res) {
        console.log('signing in with google');
        console.log(url);
        res.send(url);
    });

    app.get('/api/auth/google/token', function (req, res) {
        var code = req.headers.code.trim().replace('%2F', '/'); // This is what was causing it to not work
        if (code !== null) {
            console.log(code);

            oauth2Client.getToken(code, function (err, tokens) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                console.log(tokens);
                if (!err) {
                    oauth2Client.setCredentials(tokens);
                    calendar.events.list({
                        auth: oauth2Client,
                        calendarId: 'primary',
                        timeMin: (new Date()).toISOString(),
                        maxResults: 10,
                        singleEvents: true,
                        orderBy: 'startTime'
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err);
                            return;
                        }
                        var events = response.items;
                        if (events.length === 0) {
                            console.log('No upcoming events found.');
                        } else {
                            console.log('Upcoming 10 events:');
                            for (var i = 0; i < events.length; i++) {
                                var event = events[i];
                                var start = event.start.dateTime || event.start.date;
                                console.log('%s - %s', start, event.summary);
                            }
                        }
                    });
                    plus.people.get({
                        userId: 'me',
                        auth: oauth2Client
                    }, function (err, user) {
                        if (err) {
                            console.log('The API returned an error: ' + err);
                            return;
                        } else {
                            console.log('googleplus: ' + user.id);
                        }
                    });
                    googleTokens = tokens;
                    res.send(tokens);
                }
            })
        }
    });

    app.get('/api/auth/google/insert', function (req, res) {
        //var tokens = req.headers.tokens;
        var summary = 'event summary';//req.headers.summary;
        var location = 'event location';//req.headers.description;
        var description = 'event description';//req.headers.description;
        var dateTimeStart = '2017-04-24T19:00:00-04:00';//req.headers.dateTime;
        var dateTimeEnd = '2017-04-24T19:00:00-06:00';//req.headers.dateTime;
        var timeZone = 'America/New_York';//req.headers.dateTime;
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
        /*oauth2Client.setCredentials(googleTokens);
        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            resource: event
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
        })*/
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};