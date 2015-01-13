GroupsModule.controller('GroupsController', [
    '$scope',
    '$resource',
    'GroupService',
    'SearchService',
    'userGroups',
    'profileInfo',
    'ngToast',
    function($scope, $resource, GroupService, SearchService, userGroups, profileInfo, ngToast) {
        /**
         * When creating a group, the POST requires this payload
         * @type {{name: string, description: string, publicGroup: boolean, archivedGroup: boolean}}
         */
        $scope.groups = {
            name: "",
            description: "",
            publicGroup: true,
            archivedGroup: false
        };

        $scope.userGroups = userGroups;

        /**
         * Determines the current look of the group page
         * When createGroup is true, we display the group creation view
         */
        $scope.current = {
            createGroup: false,
            searchString: $scope.$stateParams.q
        };

        /**
         * Allows the user to toggle the group creation view
         */
        $scope.newGroup = function() {
            $scope.current.createGroup = !$scope.current.createGroup;
        };

        /**
         * Allows the user to cancel group creation
         */
        $scope.cancelGroupCreate = function() {
            $scope.reset();
        };

        /**
         * Creates a new group on the server
         */
        $scope.createNewGroup = function() {
            GroupService.save($scope.groups, function() {
                $scope.reset();
                $scope.$state.reload();
                // Alert user of new group creation
                ngToast.create('The form has been successfully saved');
            });
        };

        /**
         * Resets the group creation view
         */
        $scope.reset = function() {
            $scope.groups = {};
            $scope.current.createGroup = false;
        };

        $scope.search = function() {
            // Update the route
            $scope.$state.transitionTo('account.groups.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

            // Update the group data
            SearchService.query({term: 'groups', q: $scope.current.searchString }, function(result) {
                // Now update the user groups
                $scope.userGroups = result;
            });
        };

        $scope.joinLeaveGroup = function(group, index) {
            if(!group.member) {
                GroupService.join(
                    { groupId: group.groupId, username: profileInfo.username },
                    null,
                    function(response) {
                        if(response.isMember) {
                            $scope.$state.reload();
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
                            $scope.$state.reload();
                        }
                    }
                );
            }
        }
    }
]);