/**
 * This controller allows a modal instance to be created
 */

StatusModule.controller('StatusManagerController', ['$scope', '$modal', 'ReplyService', 'StatusService', function($scope, $modal, ReplyService, StatusService) {
    $scope.showModal = function(statusId) {
        ReplyService.statusId = statusId;
        ReplyService.isReply = statusId ? true : false;
        console.log(statusId);
        console.log(ReplyService.isReply);
        var modalInstance = $modal.open({
            templateUrl: '/app/components/home/status/StatusView.html',
            controller: 'StatusCreateController',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                currentStatus: function(){
                    if(ReplyService.statusId){
                        console.log('Getting status');
                        var promise = StatusService.get({statusId: ReplyService.statusId}, function (result){
                            modalInstance.setCurrentStatus(result);
                        });
                    }
                    else{
                        return {}
                    }
                }
            }
        });
/*
        modalInstance.opened.then(function (){
            console.log('Loading the status');
            $scope.loadStatus(modalInstance);
        });
        */
    };

    $scope.loadStatus = function (aModalInstance){
        console.log('In loadStatus');
        console.log(ReplyService.statusId);
        if(ReplyService.statusId){
            var status = StatusService.get({statusId: ReplyService.statusId}, aModalInstance.setCurrentStatus(status));
        }

    }
}]);