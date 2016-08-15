tatamiJHipsterApp
    .controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'SearchService', 'members', function($scope, group, GroupService, SearchService, members) {
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
            $scope.searchedMembers = SearchService.query({ term: 'users', q: $scope.current.searchString });
        }
        else{
            $scope.searchedMembers = {};
        }
    };

    $scope.addUser = function(member) {
        GroupService.join(
            { groupId: $scope.group.groupId, username: member.username },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);
