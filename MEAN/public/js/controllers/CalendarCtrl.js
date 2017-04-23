angular.module('CalendarCtrl', []).controller('CalendarController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.tagline = 'View your calendar';

    var getGoogleToken = function (code) {
        $http({
            method: 'GET',
            url: '/api/auth/google/token',
            headers: {'code': code}
        }).then(function successCallback(success) {
            var access_token = success.data.access_token;
            console.log(access_token);
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