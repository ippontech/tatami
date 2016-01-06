angular.module('tatami')
    .controller('TimelineCtrl', function ($scope, LineItems) {
        $scope.lineItems = LineItems.all();
        $scope.remove = function (lineItem) {
            LineItems.remove(lineItem);
        };
    });
