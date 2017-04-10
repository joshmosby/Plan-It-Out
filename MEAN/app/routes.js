var Search = require('./models/search');

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

                // HTTP Request to Eventbrite API
                var request = require('request');

                var options = {
                    method: 'GET',
                    url: 'https://www.eventbriteapi.com/v3/events/search/',
                    qs: {
                        q: searchQuery,
                        sort_by: 'date',
                        'location.address': searchLocation,
                        categories: categoryId,
                        token: ''
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

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};