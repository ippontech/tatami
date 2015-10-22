AccountModule.controller('FormController', ['$scope', function($scope) {
    // Forwards from the parent state to the default child state.
    $scope.$on('$stateChangeSuccess', function(event, toState) {
        if(toState.name === 'tatami.account.groups') {
            $scope.$state.go('tatami.account.groups.main.top.list');
        }
        else if(toState.name === 'tatami.account.tags') {
            $scope.$state.go('tatami.account.tags.following');
        }
        else if(toState.name === 'tatami.account.users') {
            $scope.$state.go('tatami.account.users.following');
        }
    });
}]);