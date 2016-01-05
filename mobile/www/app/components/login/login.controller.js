angular.module('tatami')
    .controller('LoginController', ['$scope', '$state', 'ProfileService', '$http', function($scope, $state, ProfileService, $http) {
        $scope.user = {};
        $scope.shown = false;
        $scope.failed = false;

        $scope.login = function() {
            ProfileService.get(function(success) {
                $scope.shown = true;
                console.log(success);
                $state.go('tab.dash');
            }, function(error) {
                $scope.failed = true;
                console.log(error);
            });
        }
    }]);
