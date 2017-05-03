angular.module('CalendarCtrl', []).controller('CalendarController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    var googleTokens;
    var userId;

    var today = new Date().toISOString().substring(0, 10);
    $scope.eventSources = [
        {
            events: [
                {
                    title: 'Earliest Time',
                    start: today,
                    stick: true
                },
                {
                    title: 'Latest Time',
                    start: today,
                    stick: true
                }
            ],
            color: 'yellow',
            textColor: 'black'
        }
    ];

    /* var start = new Date().toISOString();
     var end = '2117-05-02T12:00:00';

     $scope.alertOnDayClick = function (date, jsEvent, view) {
     console.log('day clicked: ' + date.format());
     if (date.format() < end.format()) {
     $(this).css('background-color', 'blue');
     } else {

     }
     $http({
     method: 'GET',
     url: '/api/search-from-calendar',
     headers: {
     start: date.format(),//'2017-05-02T12:00:00',
     end: date.format()//'2017-05-02T14:00:00'
     }
     }).then(function successCallback(success) {
     console.log(success.data.events);
     }, function errorCallback(error) {
     console.log(error);
     })
     };*/

    var earliestTime = new Date();
    earliestTime.setHours(earliestTime.getHours() - 4);
    earliestTime = earliestTime.toISOString().substring(0, 10);
    var latestTime = new Date().toISOString().substring(0, 10);

    $scope.alertOnDrop = function (event, delta, revertFunc) {
        if (event.title === 'Earliest Time') {
            earliestTime = event.start.format();
            $scope.FindEventsInTimeRange();
        }
        if (event.title === 'Latest Time') {
            latestTime = event.start.format();
            $scope.FindEventsInTimeRange();
        }
    };

    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                //left: 'month basicWeek basicDay agendaWeek agendaDay',
                //center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            dayClick: $scope.alertOnDayClick
        }
    };

    var last_date = new Date().toISOString();

    $scope.FindEventsInTimeRange = function () {
        if (earliestTime.indexOf('T') < 0) {
            earliestTime += 'T00:00:00';
        }
        if (latestTime.indexOf('T') < 0) {
            latestTime += 'T23:59:59'
        }
        if (earliestTime > latestTime) {
            $scope.isError = true;
            $scope.errorMessage = 'Earliest Time needs to be before Latest Time';
            $scope.searchResults = [];
            return;
        }
        $scope.isError = false;
        console.log('early: ' + earliestTime);
        console.log('late: ' + latestTime);
        $scope.isLoading = true;
        $http({
            method: 'GET',
            url: '/api/search-from-calendar',
            headers: {
                start: earliestTime,
                end: latestTime
                //start: '2017-05-02T12:00:00',
                //end: '2017-05-09T14:00:00'
            }
        }).then(function successCallback(success) {
            console.log(success.data.events);
            $scope.searchResults = success.data;
            if (success.data.events.length === 0) {
                $scope.noResults = true;
                $scope.errorMessage = 'No events found in your time slot.';
            }
            $scope.isLoading = false;
        }, function errorCallback(error) {
            console.log(error);
            $scope.isLoading = false;
        })
    };

    $scope.DisplayStart = function (start) {
        return 'hi';
    };

    $scope.eventClicked = function (event) {
        $scope.selectedEvent = event;
        $window.open(event.url);
    };

    $scope.GoingToEvent = function () {
        var summary = $scope.selectedEvent.name.text;
        var venue = $scope.selectedEvent.venue.address;
        var location = venue.address_1 + ', ' + venue.city + ', ' + venue.region + ', ' + venue.country;
        var description = $scope.selectedEvent.description.text;
        var start = $scope.selectedEvent.start.local;
        var end = $scope.selectedEvent.end.local;
        var timezone = $scope.selectedEvent.start.timezone;
        insertCalendarEvent(summary, location, description, start, end, timezone);
    };

    var loadMoreEvents = function () {
        console.log(last_date);
        console.log('here is the token: ');
        console.log(googleTokens);
        $http({
            method: 'GET',
            url: '/api/google/events',
            headers: {
                'start': last_date
                //'googleTokens': googleTokens,
                //'userId': userId
            }
        }).then(function successCallback(success) {
            var events = success.data;
            if (events.length === 0) {
                console.log('No upcoming events found.');
                return;
            }
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                $scope.eventSources[0].events.push({
                    title: event.summary,
                    start: event.start.dateTime.toString(),
                    end: event.end.dateTime.toString(),
                    stick: true
                });
                last_date = event.start.dateTime;
            }

        }, function errorCallback(error) {
            console.log(error);
        })
    };

    var insertCalendarEvent = function (summary, location, description, start, end, timezone) {
        $http({
            method: 'GET',
            url: '/api/google/insert',
            headers: {
                'summary': summary,
                'location': location,
                'description': '',//description.substring(0,5),
                'start': start,
                'end': end,
                'timezone': timezone
            }
        }).then(function successCallback(success) {
            // Note: could be here even if adding calendar wasn't successful.
            // Need to check if success.data == a calendar url
            console.log(success.data);
            if (success.data.indexOf('https://www.google.com/calendar/event') < 0) {
                return;
            }
            $scope.eventSources[0].events.push({
                title: summary,
                start: start,
                end: end,
                stick: true
            });
        }, function errorCallback(error) {
            console.log(error);
        });
    };

    var getGoogleToken = function (code) {
        $http({
            method: 'GET',
            url: '/api/google/auth/token',
            headers: {'code': code}
        }).then(function successCallback(success) {
            var access_token = success.data.tokens.access_token;
            googleTokens = success.data.tokens;
            userId = success.data.id;
            console.log(googleTokens);
            console.log(userId);
            loadMoreEvents();
        }, function errorCallback(error) {
            console.log(error);
        });
    };

    var checkIfGoogleCodeInUrl = function () {
        var url = $window.location.href;
        var codeIndex = url.lastIndexOf('code=');
        if (codeIndex > -1) {
            var code = url.substring(codeIndex + 5);
            getGoogleToken(code);
        }
    };

    checkIfGoogleCodeInUrl();
}]);