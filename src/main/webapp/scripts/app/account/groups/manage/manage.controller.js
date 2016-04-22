tatamiJHipsterApp
    .controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'SearchService', 'members', function($scope, group, GroupService, SearchService, members) {
    $scope.group = group;
    $scope.members = members;
        console.log($scope.members);
    $scope.searchedMembers = {};
    $scope.current = { searchString: '' };

    $scope.updateGroup = function() {
        GroupService.update( { groupId: $scope.group.groupId }, $scope.group);
    };

    $scope.removeUser = function(member) {
        GroupService.leave(
            { groupId: $scope.group.groupId, email: member.email },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };
//
//    $scope.search = function() {
//        if($scope.current.searchString) {
//            UserService.searchUsers({ term: 'search', q: $scope.current.searchString }, function(result) {
//                $scope.searchedMembers = result;
//            });
//        }
//        else {
//            $scope.searchedMembers = {};
//        }
//    };

    $scope.search = function() {
        console.log($scope.current.searchString);
        if($scope.current.searchString) {
            $scope.searchedMembers = SearchService.query({ term: 'users', q: $scope.current.searchString });
        }
        else{
            $scope.searchedMembers = {};
        }
    };

    $scope.addUser = function(member) {
        GroupService.join(
            { groupId: $scope.group.groupId, email: member.email },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);
