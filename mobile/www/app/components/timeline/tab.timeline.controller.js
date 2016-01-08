angular.module('tatami')
    .controller('TimelineCtrl', function ($scope, lineItems) {

        $scope.lineItems = lineItems;
        $scope.remove = function(lineItem) {

            $scope.lineItems.splice(lineItems.indexOf(lineItem), 1);
        };
    });
