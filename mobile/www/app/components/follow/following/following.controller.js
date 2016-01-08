angular.module('tatami')
    .controller('FollowingCtrl', ['$scope', 'following', function($scope, following) {
        $scope.following = following;
    }]
);
