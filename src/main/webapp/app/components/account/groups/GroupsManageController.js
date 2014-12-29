GroupsModule.controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'members', function($scope, group, GroupService, members) {
    $scope.group = group;
    $scope.members = members;

    $scope.updateGroup = function() {
        GroupService.update( { groupId: $scope.group.groupId }, $scope.group);
    }

    $scope.getUserRole = function(member) {
        if(member.role === 'ADMIN') {
            return ''
        }
    }
}]);