HomeModule.controller('HomeController', ['$scope', 'TimelineService', 'ProfileService', 'StatusService', 
    function($scope, TimelineService, ProfileService, StatusService) {
        
        $scope.statuses = TimelineService.query();
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

        $scope.deleteStatus = function(status) {
            StatusService.delete({ statusId: status.statusId }, { },
                function() { 
                    var index = $scope.statuses.indexOf(status);
                    $scope.statuses.splice(index, 1);
            });
        }
}]);