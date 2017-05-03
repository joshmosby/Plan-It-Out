angular.module('PrefCtrl', []).controller('PrefController', ['$scope', '$http', function ($scope, $http) {


    $scope.categoryList = {
        'All Categories': false,
        'Music': false,
        'Business & Professional': false,
        'Food & Drink': false,
        'Community & Culture': false,
        'Performing & Visual Arts': false,
        'Film, Media & Entertainment': false,
        'Sports & Fitness': false,
        'Health & Wellness': false,
        'Science & Technology': false,
        'Travel & Outdoor': false,
        'Charity & Causes': false,
        'Religion & Spirituality': false,
        'Seasonal & Holiday': false,
        'Government & Politics': false,
        'Fashion & Beauty': false,
        'Home & Lifestyle': false,
        'Auto, Boat & Air': false,
        'Hobbies & Special Interest': false,
        'Other': false
    };

    $scope.SavePrefs = function () {
        console.log($scope.categoryList);
    }

}]);