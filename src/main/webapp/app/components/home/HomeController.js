HomeModule.controller('HomeController', ['$scope', 'ProfileService', 'StatusService', 
    function($scope, ProfileService, StatusService) {
        
        $scope.statuses = StatusService.getTimeline();
        $scope.profile = ProfileService.get();

        $scope.favoriteStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) { 
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses[index] = response;
                    // should I only update the favorite property of the status 
                    // or update the whole status in the model?
            });
        },

        $scope.shareStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) { 
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses[index]['shareByMe'] = true;
                    // for some reason the shareByMe property is still false in the server
                    // response, possible backend bug?
            });
        },

        $scope.deleteStatus = function(status) {
            StatusService.delete({ statusId: status.statusId }, { },
                function() { 
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses.splice(index, 1);
            });
        }
}]);