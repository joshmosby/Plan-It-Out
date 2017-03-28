module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    app.get('/api/search', function (req, res) {
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            qs: {
                q: req.headers.query,
                sort_by: 'date',
                'location.address': req.headers.location,
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