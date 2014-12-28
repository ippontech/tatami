AccountModule.controller('FormController', ['$scope', function($scope) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        //console.log('Switching state to ' + toState.name);
        if(toState.name === 'account.groups') {
            $scope.$state.go('account.groups.list');
        }
        else if(toState.name === 'account.tags') {
            $scope.$state.go('account.tags.list');
        }
        else if(toState.name === 'account.users') {
            $scope.$state.go('account.users.list');
        }
    });
}]);