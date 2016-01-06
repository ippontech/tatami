angular.module('tatami')
    .controller('DashCtrl', ['$scope', 'user', function ($scope, user) {
        $scope.user = user;
        console.log($scope.user);
    }]
);
