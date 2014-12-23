UsersModule.controller('UsersController', [
    '$scope',
    '$resource',
    '$location',
    'UserService',
    'ProfileService',
    'SearchService', 
    function($scope, $resource, $location, UserService, ProfileService, SearchService) {
        /**
         * Ideally this would be done during routing
         */
        $scope.getUsers = function() {
            ProfileService.get().$promise.then(function(result) {
                UserService.getFriends({ userId: result.username }, function(friendList) {
                    $scope.usersGroup = friendList;
                });
            })
        };

        $scope.current = {
            searchString: ''
        }

        /**
         * If toState.data.dataUrl is undefined, it means we are get the user friends, and so we call $scope.getUsers(),
         * If however, a valid url is passed in, we will query that path.
         */
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
            if($scope.current.searchString){
                SearchService.query({term: 'users', q: $scope.current.searchString }, function(result) {
                    $scope.tags = result;
                });
            }
            if(toState.data.dataUrl == "search"){
                $scope.userGroups = {};
            }
            else if(toState.data.dataUrl) {
                $resource(toState.data.dataUrl).query(function(result) {
                    $scope.userGroups = result;
                });
            }
            else {
                $scope.getUsers();
            }
        });

        $scope.isActive = function(path) {
            return path === $location.path();
        };

        $scope.search = function() {
            console.log($scope.current.searchString);
            // Update the route
            $state.go('account.users.search', { q: $scope.current.searchString });
        }
    }
]);