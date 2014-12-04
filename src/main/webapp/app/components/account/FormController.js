AccountModule.controller('FormController', ['$scope', '$state', function($scope, $state) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParam) {
        if(toState.name === 'account.groups') {
            $state.go('account.groups.list');
        }
    });
}]);