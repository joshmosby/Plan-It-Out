angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

    // home page
        .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })

    .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchController'
    })

    .when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'CalendarController'
    })

    .when('/preferences', {
        templateUrl: 'views/preferences.html',
        controller: 'PrefController'
    });

    $locationProvider.html5Mode(true);

}]);