GroupsModule.controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'members', function($scope, group, GroupService, members) {
    $scope.group = group;
    $scope.members = members;

    $scope.updateGroup = function() {
        GroupService.update( { groupId: $scope.group.groupId }, $scope.group);
    };

    $scope.removeUser = function(member) {
        GroupService.leave(
            { groupId: $scope.group.groupId, username: member.username },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);