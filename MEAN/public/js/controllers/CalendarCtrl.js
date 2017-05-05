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
        $http({
            method: 'GET',
            url: '/api/prefs/get'
        }).then(function successCallback(success) {
            var location = success.data.location;
            var categories = success.data.categories;
            if (location && categories) {
                FindEventsInTimeRangeHelper(location, categories);
            } else {
                FindEventsInTimeRangeHelper('', '');
            }
        }, function errorCallback(error) {
            console.log(error);
        });
    };

    var FindEventsInTimeRangeHelper = function (location, categories) {
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
        $scope.isLoading = true;
        $http({
            method: 'GET',
            url: '/api/search-from-calendar',
            headers: {
                start: earliestTime,
                end: latestTime,
                location: location,
                categories: JSON.stringify(categories)
            }
        }).then(function successCallback(success) {
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

    $scope.EventClicked = function (event) {
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

    $scope.LoadMoreEvents = function (reload) {
        $http({
            method: 'GET',
            url: '/api/google/events',
            headers: {
                'start': last_date,
                'reload': reload
                //'googleTokens': googleTokens,
                //'userId': userId
            }
        }).then(function successCallback(success) {
            var events = success.data;
            if (events.length === 0) {
                console.log('No upcoming events found.');
                return;
            }
            if (reload === true) {
                $scope.eventSources[0].events = [];
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
            method: 'POST',
            url: '/api/google/insert',
            headers: {
                'summary': summary,
                'location': location,
                'description': '',
                'start': start,
                'end': end,
                'timezone': timezone
            }
        }).then(function successCallback(success) {
            if (success.data.indexOf('https://www.google.com/calendar/event') < 0) {
                return;
            }
            $scope.eventSources[0].events.push({
                title: summary,
                start: start,
                end: end,
                stick: true
            });
            $scope.LoadMoreEvents(true);
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
            googleTokens = success.data.tokens;
            userId = success.data.id;
            $scope.LoadMoreEvents(false);
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
        } else {
            $scope.LoadMoreEvents(false);
        }
    };

    checkIfGoogleCodeInUrl();
}]);