AccountModule.controller('FormController', ['$scope', function($scope) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        //console.log('Switching state to ' + toState.name);
        if(toState.name === 'account.groups') {
            console.log('From state: ' + fromState.name);
            $state.go('account.groups.list');
        }
    });
}]);