angular.module('tatami')
    .controller('LineItemDetailCtrl', function ($scope, $stateParams, LineItems) {
        $scope.lineItem = LineItems.get($stateParams.lineItemId);
    });
