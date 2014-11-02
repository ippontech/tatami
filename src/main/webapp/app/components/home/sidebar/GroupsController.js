SidebarModule.controller('GroupsController', ['$scope', 'GroupService', function($scope, GroupService) {
    $scope.groups = GroupService.query();
}]);