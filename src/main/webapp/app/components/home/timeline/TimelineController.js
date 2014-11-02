TimelineModule.controller('TimelineController', ['$scope', 'TimelineService', 'ProfileService', 
    function($scope, TimelineService, ProfileService) {
        $scope.statuses = TimelineService.query();
        $scope.profile = ProfileService.get();
}]);