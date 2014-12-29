/**
 * This controller allows a post modal instance to be created
 */

PostModule.controller('StatusManagerController', ['$scope', '$modal', 'StatusService', function($scope, $modal, StatusService) {
    $scope.showModal = function(statusId) {
        var modalInstance = $modal.open({
            templateUrl: '/app/components/home/post/PostView.html',
            controller: 'StatusCreateController',
            keyboard: false,
            resolve: {
                currentStatus: function() {

                }
            }
        });

        modalInstance.opened.then(function() {
            if(statusId) {
                var promise = StatusService.get({ statusId: statusId }, function(result) {
                    modalInstance.setCurrentStatus(result);
                });
            }
            else {
                return {}
            }
        });
    };
}]);