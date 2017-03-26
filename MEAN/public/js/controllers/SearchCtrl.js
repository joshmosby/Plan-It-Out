angular.module('SearchCtrl', []).controller('SearchController', ['$scope', '$http', function ($scope, $http) {

    $scope.searchResults = {};
    $scope.SearchFunction = function () {
        var query = $scope.searchQuery;
        $http({
            method: 'GET',
            url: '/api/search',
            headers: {
                'query': query
            }
        }).then(function successCallback(success) {
            $scope.searchResults = success.data;
            console.log(success);
        }, function errorCallback(error) {
            console.log(error);
        });
    };
}]);