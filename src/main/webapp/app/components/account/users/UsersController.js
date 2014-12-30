UsersModule.controller('UsersController', ['$scope', 'usersList', 'SearchService', 'UserService', function($scope, usersList, SearchService, UserService){
    /**
     * Information about the current state of the view
     * @type {{searchString: string}}
     */
    $scope.current = {
        searchString: $scope.$stateParams.q
    };

    // usersList is resolved during routing
    $scope.usersList = usersList;

    /**
     * Change the state (so the url contains the search parameter), and updates
     * the user data based on the search term.
     */
    $scope.search = function (){
        // Update the route
        $scope.$state.transitionTo('account.users.search',
            { q: $scope.current.searchString },
            { location: true, inherit: true, relative: $scope.$state.$current, notify: false });

        // Now update the users based on the search term
        SearchService.query({term: 'users', q: $scope.current.searchString }, function (result){
            $scope.usersList = result;
        });
    };

    $scope.followUser = function (user, index){
        UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true },
            function (response){
                $scope.$state.reload();
            }
        );
    };

    $scope.getAvatar = function(user) {
        if(user.avatar){
            return "/tatami/avatar/" + user.avatar + "/photo.jpg"
        }
        else {
            return "/assets/img/default_image_profile.png"
        }
    }
}]);