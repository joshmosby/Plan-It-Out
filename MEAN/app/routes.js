module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    app.get('/api/search', function (req, res) {
        var categories = {
            'All categories': '',
            'Music': 103,
            'Business & Professional': 101,
            'Food & Drink': 110,
            'Community & Culture': 113,
            'Performing & Visual Arts': 105,
            'Film, Media & Entertainment': 104,
            'Sports & Fitness': 108,
            'Health & Wellness': 107,
            'Science & Technology': 102,
            'Travel & Outdoor': 109,
            'Charity & Causes': 111,
            'Religion & Spirituality': 114,
            'Family & Education': 115,
            'Seasonal & Holiday': 116,
            'Government & Politics': 112,
            'Fashion & Beauty': 106,
            'Home & Lifestyle': 117,
            'Auto, Boat & Air': 118,
            'Hobbies & Special Interest': 119,
            'Other': 199
        };
        var category = req.headers.category;
        var categoryId = categories[category];

        var request = require("request");

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

        request(options, function (error, response, body) {
            if (error) {
                throw new Error(error);
            }
            res.send(body);
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

};