/**
 * This controller allows a modal instance to be created
 */

StatusModule.controller('StatusManagerController', ['$scope', '$modal', function($scope, $modal) {
    $scope.openStatusModal = function() {
        var options = {
            backdrop: 'static',
            templateUrl: '/app/components/home/status/StatusView.html',

            controller: 'StatusCreateController'
        };
        $scope.modalInstance = $modal.open(options);
    }
}]);