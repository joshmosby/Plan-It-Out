angular.module('SearchCtrl', []).controller('SearchController', ['$scope', '$http', function ($scope, $http) {

    $scope.isError = false;
    $scope.SearchFunction = function () {
        $scope.searchResults = {};
        var query = $scope.searchQuery;
        var location = $scope.inputLocation;
        $scope.errorMessage = "";
        if (query === "" && location === "") {
            $scope.isError = true;
            $scope.errorMessage = "Please enter either a location or event."
        } else {
            $scope.isError = false;
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
        }
    };
}]);