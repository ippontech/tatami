tatamiJHipsterApp
    .controller('GroupsController', [
    '$scope',
    '$state',
    'GroupService',
    'SearchService',
    'profileInfo',
    function($scope, $state, GroupService, SearchService, profileInfo) {
        if($scope.$state.name === 'groups') {
            $scope.$state.go('list');
        }
        $scope.$state = $state;
        /**
         * Determines the current look of the group page
         * When createGroup is true, we display the group creation view
         */

        $scope.joinLeaveGroup = function(group) {
            if(!group.member) {
                GroupService.join(
                    { groupId: group.groupId, username: profileInfo.username },
                    null,
                    function(response) {
                        if(response.isMember) {
                            $state.reload();
                        }
                    }
                );
            }

            else {
                GroupService.leave(
                    { groupId: group.groupId, username: profileInfo.username },
                    null,
                    function(response) {
                        if(response) {
                            $state.reload();
                        }
                    }
                );
            }
        };
    }
]);
