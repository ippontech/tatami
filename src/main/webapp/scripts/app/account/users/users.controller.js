'use strict';

tatamiJHipsterApp
    .controller('UsersController', ['$scope', 'usersList', 'SearchService', 'UserService', 'userRoles', function($scope, usersList, SearchService, UserService, userRoles) {
        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;
        /**
         * Information about the current state of the view
         * @type {{searchString: string}}
         */
        $scope.current = {
            searchString: $scope.$stateParams.q
        };

        // usersList is resolved during routing
        $scope.usersList = usersList;

        $scope.deactivate = function(user, index) {
            UserService.deactivate({ email: user.email }, { activate: true }, function(response) {
                $scope.usersList[index].activated = response.activated;
            });
        };

        /**
         * Change the state (so the url contains the search parameter), and updates
         * the user data based on the search term.
         */
        $scope.search = function() {
            // Update the route
            $scope.$state.transitionTo('tatami.account.users.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

            // Now update the users based on the search term
            SearchService.query({ term: 'users', q: $scope.current.searchString }, function(result) {
                $scope.usersList = result;
            });
        };

        $scope.followUser = function(user) {
            UserService.follow({ email: user.email }, { friend: !user.friend, friendShip: true },
                function() {
                    $scope.$state.reload();
                }
            );
        };
    }]);
