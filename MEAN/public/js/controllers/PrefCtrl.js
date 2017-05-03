angular.module('PrefCtrl', []).controller('PrefController', ['$scope', '$http', function($scope, $http) {


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
}]);