tatamiJHipsterApp
    .controller('GroupsListController', ['$scope', function($scope) {
        if($scope.$state.name === 'tatami.account.groups.main') {
            $scope.$state.go('tatami.account.groups.main.top.list');
    }
}]);
