UsersModule.controller('UsersController', [
    '$scope',
    '$resource',
    '$location',
    'UserService',
    'ProfileService',
    'SearchService',
    'usersGroup',
    function($scope, $resource, $location, UserService, ProfileService, SearchService, usersGroup) {
        /**
         * Ideally this would be done during routing
         */
        $scope.getUsers = function() {
            ProfileService.get().$promise.then(function(result) {
                UserService.getFollowing({ username: result.username }, function(friendList) {
                    $scope.usersGroup = friendList;
                });
            })
        };

        $scope.current = {
            searchString: ''
        };

        $scope.usersGroup = usersGroup;

        $scope.isActive = function(path) {
            return path === $location.path();
        };

        $scope.search = function() {
            // Update the route
            $scope.$state.transitionTo('account.users.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

            // Update the group data
            SearchService.query({term: 'users', q: $scope.current.searchString }, function(result) {
                // Now update the user groups
                $scope.userGroups = result;
            });
        }
    }
]);