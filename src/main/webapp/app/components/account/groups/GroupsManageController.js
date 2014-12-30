GroupsModule.controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'UserService', 'members', function($scope, group, GroupService, UserService, members) {
    $scope.group = group;
    $scope.members = members;
    $scope.searchedMembers = {};

    $scope.current = { searchString: '' };

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

    $scope.search = function() {
        if($scope.current.searchString) {
            UserService.searchUsers({ term: 'search', q: $scope.current.searchString }, function(result) {
                $scope.searchedMembers = result;
            })
        }
        else {
            $scope.searchedMembers = {};
        }
    };

    $scope.addUser = function() {

    }
}]);