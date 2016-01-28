angular.module('tatami')
    .controller('LineItemDetailCtrl', function ($scope, lineItem) {
        $scope.lineItem = lineItem;
    });
