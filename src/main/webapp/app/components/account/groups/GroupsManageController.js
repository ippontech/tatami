GroupsModule.controller('GroupsManageController', ['$scope', '$state', function($scope, $state) {
    console.log('HI');
    $scope.$state = $state;
    console.log($state.current.name);
}]);