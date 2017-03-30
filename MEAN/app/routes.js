var Search = require('./models/search');

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    app.get('/api/search', function (req, res) {
        var searchData = new Search();
        var category = req.headers.category;
        var categoryId = searchData.getCategoryId(category);

        var request = require('request');

        var options = {
            method: 'GET',
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            qs: {
                q: req.headers.query,
                sort_by: 'date',
                'location.address': req.headers.location,
                categories: categoryId,
                token: 'MIOBXG4I3HB2ZH7IZINI'
            }
        };

        searchData.query = req.headers.query;
        searchData.location = req.headers.location;
        searchData.category = category;

        request(options, function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            searchData.results = body;
            searchData.save();
            res.send(body);
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};