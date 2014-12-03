/**
 * Handles group management
 *
 * This controller might be doing to much and may be refactored into two separate controllers
 */

GroupsModule.controller('AccountGroupsController', [
    '$scope',
    '$state',
    '$resource',
    'GroupService',
    'GroupMemberService',
    '$routeParams',
    '$location',
    'SearchService',
    function($scope, $state, $resource, GroupService, GroupMemberService, $routeParams, $location, SearchService) {

        $scope.$state = $state;
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

        /**
         * When we change to this state, load the data from the url specified by toState.data.dataUrl
         */
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
            if($scope.current.searchString != '') {
                // We are searching
                SearchService.query({term: 'groups', q: $scope.current.searchString }, function(result) {
                    // Now update the user groups
                    $scope.userGroups = result;
                });
            }
            else if(toState.data.dataUrl) {
                // State switched. Use provided dataUrl to fetch new data
                $resource(toState.data.dataUrl).query(function(result) {
                    $scope.userGroups = result;
                })
            }
            else {
                $scope.userGroups = {};
            }
        });

        /**
         * Determines the current look of the group page
         * When createGroup is true, we display the group creation view
         */
        $scope.current = {
            createGroup: false,
            searchString: ''
        };

        $scope.isActive = function(path) {
            return path === $location.path();
        };
        /**
         * This is designed to get the number of members in a given group
         * @param currentGroupId We want to find the number of members in the group with this id
         *
         * Currently this isn't working, it causes angular to die
         */
        $scope.getMembers = function(currentGroup) {
            var memberCount = 1;
            GroupMemberService.query({ groupId: currentGroup.groupId }, function(result) {
                memberCount = result.length;
                console.log(result);
            });
            $scope.members = memberCount;
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
            console.log($scope.groups);
            GroupService.save($scope.groups, function() {
                $scope.reset();
                // Alert user of new group creation
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
            $state.go('account.groups.search', { q: $scope.current.searchString });
        }
}]);