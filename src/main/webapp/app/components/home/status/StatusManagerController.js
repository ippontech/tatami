/**
 * This controller allows a modal instance to be created
 */

StatusModule.controller('StatusManagerController', ['$scope', '$modal', 'StatusService', function($scope, $modal, StatusService) {
    $scope.showModal = function(statusId) {
        var modalInstance = $modal.open({
            templateUrl: '/app/components/home/status/StatusView.html',
            controller: 'StatusCreateController',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                currentStatus: function(){

                }
            }
        });

        modalInstance.opened.then(function (){
            if(statusId){
                var promise = StatusService.get({statusId: statusId}, function (result){
                    modalInstance.setCurrentStatus(result);
                });
            }
            else{
                return {}
            }
        });
    };
}]);