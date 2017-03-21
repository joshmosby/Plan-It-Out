function submitFunction() {
    makeRequest(document.getElementById('search').value);
}

function makeRequest(query) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.eventbriteapi.com/v3/events/search/?q=" + query + "&token=MIOBXG4I3HB2ZH7IZINI",
        "method": "GET"
    };

    $.ajax(settings).done(function(response) {
        console.log(response);
        var events = response.events;
        var eventsString = '';
        //console.log("Entering loop");
        events.forEach(function(event) {
            //console.log("in loop");
            eventsString += (event.name.text + "<br>");
        });
        //console.log("out of loop");
        if (eventsString == '') {
            console.log("no events");
            eventsString = "Sorry, no events matching " + query;
        }
        document.getElementById("result").innerHTML = eventsString;
    });
}