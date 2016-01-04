angular.module('tatami')
    .controller('LoginController', ['$scope', '$state', 'ProfileService', function ($scope, $state, ProfileService) {
        $scope.data = {};
        $scope.shown = false;
        $scope.failed = false;

        $scope.login = function() {
            ProfileService.get(function(success) {
                $scope.shown = true;
                console.log(success);
                $state.go('tab.dash');
            }, function(error) {
                $scope.failed = true;
                console.log(JSON.stringify(error, null, 4));
            });
        }
    }]);
