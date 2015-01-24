/**
 * This controller allows a post modal instance to be created
 */

PostModule.controller('StatusManagerController', ['$scope', '$modal', 'StatusService', function($scope, $modal, StatusService) {
    $scope.showModal = function(statusId) {
        var modalInstance = $modal.open({
            templateUrl: '/app/shared/topMenu/post/PostView.html',
            controller: 'StatusCreateController',
            keyboard: true,
            resolve: {
                curStatus: ['StatusService', function(StatusService) {
                    if(statusId) {
                        return StatusService.get({ statusId: statusId }).$promise;
                    }
                }],

                groups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }]
            }
        });
    };
}]);