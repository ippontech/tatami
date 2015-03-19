TatamiApp.controller('TypeaheadController', ['$scope', function($scope) {

    $scope.activate = function(item) {
        $scope.isActive = item;
    };

    $scope.isActive = function(item) {
        return $scope.isActive === item;
    };
}]);