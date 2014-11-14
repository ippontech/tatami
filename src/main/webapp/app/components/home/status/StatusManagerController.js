/**
 * This controller allows a modal instance to be created
 */

StatusModule.controller('StatusManagerController', ['$scope', '$modal', function($scope, $modal) {
    $scope.showModal = function(/*statusId*/) {
        //ReplyStatus.replyToStatus = statusId;
        var modalInstance = $modal.open({
            templateUrl: '/app/components/home/status/StatusView.html',
            controller: 'StatusCreateController',
            backdrop: 'static',
            keyboard: false
        });
    };
}]);