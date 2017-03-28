angular.module('SearchCtrl', []).controller('SearchController', ['$scope', '$http', function ($scope, $http) {

    $scope.searchResults = {};
    $scope.SearchFunction = function () {
        var query = $scope.searchQuery;
        var location = $scope.inputLocation;
        $http({
            method: 'GET',
            url: '/api/search',
            headers: {
                'query': query,
                'location': location
            }
        }).then(function successCallback(success) {
            $scope.searchResults = success.data;
            console.log(success);
        }, function errorCallback(error) {
            console.log(error);
        });
    };
}]);