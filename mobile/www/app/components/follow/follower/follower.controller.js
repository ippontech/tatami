angular.module('tatami')
    .controller('FollowerCtrl', ['$scope', 'followers', function($scope, followers) {
        $scope.followers = followers;
    }]
);
