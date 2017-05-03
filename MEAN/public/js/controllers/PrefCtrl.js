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
        $http({
            method: 'POST',
            url: '/api/prefs/save',
            headers: {
                'location': $scope.inputLocation.toLowerCase().trim(),
                'categories': JSON.stringify($scope.categoryList)
            }
        }).then(function successCallback(success) {
            console.log(success);
        }, function errorCallback(error) {
            console.log(error);
        });
    }

}]);