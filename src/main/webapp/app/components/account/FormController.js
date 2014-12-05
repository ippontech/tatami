AccountModule.controller('FormController', ['$scope', '$state', function($scope, $state) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        //console.log('Switching state to ' + toState.name);
        if(toState.name === 'account.groups') {
            console.log('From state: ' + fromState.name);
            $state.go('account.groups.list');
        }
    });
}]);