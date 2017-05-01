angular.module('CalendarCtrl', []).controller('CalendarController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.eventSources = [
        {
            events: []
        }
    ];

    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };

    var getCalendarEvents = function () {
        $http({
            method: 'GET',
            url: '/api/google/events'
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
                })
            }

        }, function errorCallback(error) {
            console.log(error);
        })
    };

    var insertCalendarEvent = function () {
        $http({
            method: 'GET',
            url: '/api/google/insert',
            headers: {
                'summary': 'event summary',
                'location': 'event location',
                'description': 'event description',
                'start': '2017-04-24T19:00:00-04:00',
                'end': '2017-04-24T19:00:00-06:00',
                'timezone': 'America/New_York'
            }
        }).then(function successCallback(success) {
            // Note: could be here even if adding calendar wasn't successful.
            // Need to check if success.data == a calendar url
            console.log(success.data);
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
            var access_token = success.data.access_token;
            console.log(access_token);
            getCalendarEvents();
            //insertCalendarEvent();
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