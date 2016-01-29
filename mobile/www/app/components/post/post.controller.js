angular.module('tatami')
    .controller('PostCtrl', ['$scope', '$state', '$ionicHistory', 'StatusService', function($scope, $state, $ionicHistory, StatusService) {
        $scope.charCount = 750;
        $scope.status = {
            content: '',
            statusPrivate: false
        };

        $scope.post = function() {
            StatusService.save($scope.status, function() {
                $scope.reset();
                $ionicHistory.clearCache();
                $state.go('timeline');
            })
        };

        $scope.reset = function() {
            $scope.status = {
                content: '',
                statusPrivate: false
            }
        }

    }]
);
