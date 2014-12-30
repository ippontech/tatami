AccountModule.controller('FormController', ['$scope', function($scope) {
    // Forwards from the parent state to the default child state.
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        if(toState.name === 'account.groups') {
            $scope.$state.go('account.groups.list');
        }
        else if(toState.name === 'account.tags') {
            $scope.$state.go('account.tags.following');
        }
        else if(toState.name === 'account.users') {
            $scope.$state.go('account.users.following');
        }
    });
}]);