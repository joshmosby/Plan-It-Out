angular.module('SearchCtrl', []).controller('SearchController', ['$scope', '$http', function ($scope, $http) {

    $scope.searchQuery = "";
    $scope.inputLocation = "";
    $scope.errorMessage = "";
    $scope.isError = false;
    $scope.isLoading = false;

    $scope.SearchFunction = function () {
        $scope.searchResults = {};
        var query = $scope.searchQuery;
        var location = $scope.inputLocation;
        if ((query === "" || query === null) && (location === "" || location === null)) {
            $scope.isError = true;
            $scope.errorMessage = "Please enter either a location or event."
            $scope.isLoading = false;
        } else {
            $scope.isLoading = true;
            $scope.errorMessage = "";
            console.log("query: " + query);
            $scope.isError = false;
            $http({
                method: 'GET',
                url: '/api/search',
                headers: {
                    'query': query,
                    'location': location
                }
            }).then(function successCallback(success) {
                $scope.isLoading = false;
                $scope.searchResults = success.data;
                console.log(success);
            }, function errorCallback(error) {
                $scope.isLoading = false;
                console.log(error);
            });
        }
    };
}]);