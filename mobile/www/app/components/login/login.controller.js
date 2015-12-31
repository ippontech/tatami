angular.module('tatami')
    .controller('LoginController', ['$scope', '$state', function ($scope, $state) {
        $scope.data = {};

        $scope.login = function() {
            $state.go('tab.dash');
        }
    }]);