tatamiJHipsterApp
    .controller('GroupsListController', ['$scope','GroupService','$state', function($scope,GroupService,$state) {
    $scope.username = $scope.$parent.username.data.username;
    $scope.joinLeaveGroup = function(group) {
                if(!group.member) {
                    GroupService.join(
                        { groupId: group.groupId, username: $scope.username },
                        null,
                        function() {

                                $state.reload();

                        }
                    );
                }

                else {
                    GroupService.leave(
                        { groupId: group.groupId, username: $scope.username },
                        null,
                        function() {
                            $state.reload();
                        }
                    );
                }
            };
}]);
