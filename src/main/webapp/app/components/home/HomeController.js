HomeModule.controller('HomeController', ['$scope', 'TimelineService', 'ProfileService', 'StatusService', 
    function($scope, TimelineService, ProfileService, StatusService) {
        
        $scope.statuses = TimelineService.query();
        $scope.profile = ProfileService.get();

        $scope.favorite = function(statusId, isFavorited, index) {
            response = StatusService.update({ statusId: statusId }, { favorite: !isFavorited }, 
                function(response) { 
                    $scope.statuses[index] = response;
                    // should I only update the favorite property of the status 
                    // or update the whole status in the model?
            });
        }
}]);