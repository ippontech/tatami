tatamiJHipsterApp.controller('FormController', ['$scope', function($scope) {
    // Forwards from the parent state to the default child state.
    $scope.$on('$stateChangeSuccess', function(event, toState) {
        if(toState.name === 'account.groups') {
            $scope.$state.go('tatami.account.groups.main.top.list');
        }
        else if(toState.name === 'account.tags') {
            $scope.$state.go('following');
        }
        else if(toState.name === 'account.users') {
            $scope.$state.go('tatami.account.users.following');
        }
    });
}]);
