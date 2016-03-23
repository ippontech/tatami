tatamiJHipsterApp
    .controller('GroupsController', [
    '$scope',
    '$state',
    'GroupService',
    'SearchService',
    /*'userGroups',*/
    'profileInfo',
    function($scope, $state, GroupService, SearchService, /*userGroups,*/ profileInfo) {
        //$scope.userGroups = userGroups;
        $scope.$state = $state;
        console.log($state.$current);
        /**
         * Determines the current look of the group page
         * When createGroup is true, we display the group creation view
         */

        $scope.current = {
            searchString: $scope.$stateParams.q
        };

        /*$scope.search = function() {
            // Update the route
            $scope.$state.transitionTo('tatami.account.groups.main.top.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

            // Update the group data
            SearchService.query({term: 'groups', q: $scope.current.searchString }, function(result) {
                // Now update the user groups
                $scope.userGroups = result;
            });
        };*/

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
