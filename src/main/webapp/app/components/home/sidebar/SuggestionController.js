SidebarModule.controller('SuggestionController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.suggestions = UserService.getSuggestions();

    $scope.followUser = function(suggestion, index) {
        UserService.follow({ username: suggestion.username }, { friend: !suggestion.followingUser, friendShip: true }, 
            function(response) {
                $scope.suggestions[index].followingUser = response.friend;
        });
    }
}]);