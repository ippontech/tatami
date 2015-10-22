HomeModule.controller('SearchHeaderController', ['$scope', '$stateParams',
    function($scope, $stateParams) {
        $scope.searchTerm = $stateParams.searchTerm;
    }
]);