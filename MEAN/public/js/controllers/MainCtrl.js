angular.module('MainCtrl', []).controller('MainController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    $scope.tagline = 'Find events that fit into your free time.';

    $scope.SignInWithGoogle = function () {
        $http({
            method: 'GET',
            url: 'api/google/auth/code'
        }).then(function successCallback(success) {
            console.log(success);
            $window.location = success.data;
        }, function errorCallback(error) {
            console.log(error);
        })
    }
}]);