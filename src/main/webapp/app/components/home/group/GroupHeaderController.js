HomeModule.controller('GroupHeaderController', ['$scope', 'GroupService', 'profile', 'group',
    function($scope, GroupService, profile, group) {
        $scope.profile = profile;
        $scope.group = group;

        $scope.joinLeaveGroup = function() {
            if(!$scope.group.member) {
                GroupService.join(
                    { groupId: $scope.group.groupId, username: $scope.profile.username },
                    null,
                    function(response) {
                        if(response.isMember) {
                            console.log(response);
                            $scope.group.member = response.isMember;
                            $scope.$state.reload();
                        }
                    }
                );
            }

            else {
                GroupService.leave(
                    { groupId: $scope.group.groupId, username: $scope.profile.username },
                    null,
                    function(response) {
                        if(response) {
                            console.log(response);
                            $scope.group.member = !response;
                            $scope.$state.reload();
                        }
                    }
                );
            }
        }
    }
]);