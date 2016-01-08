angular.module('tatami')
    .controller('SuggestedCtrl', ['$scope', 'suggested', function($scope, suggested) {
        $scope.suggested = suggested;
    }]
);
