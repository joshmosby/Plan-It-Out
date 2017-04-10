angular.module('SearchCtrl', []).controller('SearchController', ['$scope', '$http', function ($scope, $http) {

    $scope.searchQuery = "";
    $scope.inputLocation = "";
    $scope.errorMessage = "";
    $scope.isError = false;
    $scope.isLoading = false;
    $scope.selectedCategory = 'All Categories';
    $scope.noResults = false;
    $scope.categoryList = [
        'All Categories',
        'Music',
        'Business & Professional',
        'Food & Drink',
        'Community & Culture',
        'Performing & Visual Arts',
        'Film, Media & Entertainment',
        'Sports & Fitness',
        'Health & Wellness',
        'Science & Technology',
        'Travel & Outdoor',
        'Charity & Causes',
        'Religion & Spirituality',
        'Seasonal & Holiday',
        'Government & Politics',
        'Fashion & Beauty',
        'Home & Lifestyle',
        'Auto, Boat & Air',
        'Hobbies & Special Interest',
        'Other'
    ];

    $scope.SearchFunction = function () {
        $scope.searchResults = {};
        $scope.noResults = false;
        var query = $scope.searchQuery;
        var location = $scope.inputLocation;
        var category = $scope.selectedCategory;
        if ((query === "" || query === null) && (location === "" || location === null)) {
            $scope.isError = true;
            $scope.errorMessage = 'Please enter either a location or event.';
            $scope.isLoading = false;
        } else {
            $scope.isError = false;
            $scope.errorMessage = "";
            $scope.isLoading = true;
            $http({
                method: 'GET',
                url: '/api/search',
                headers: {
                    'query': query,
                    'location': location,
                    'category': category
                }
            }).then(function successCallback(success) {
                $scope.isLoading = false;
                $scope.searchResults = success.data;
                if (success.data.events.length === 0) {
                    $scope.noResults = true;
                    $scope.errorMessage = 'No events found.';
                }
                console.log(success);
            }, function errorCallback(error) {
                $scope.isLoading = false;
                console.log(error);
            });
        }
    };

    $scope.ChangeCategory = function (category) {
        console.log(category);
        $scope.selectedCategory = category;
    };

    /*$('.dropdown-categories li > a').click(function () {
     console.log(this.innerHTML);
     $scope.ChangeCategory(this.innerHTML);
     });*/
}]);