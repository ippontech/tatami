angular.module('tatami')
    .controller('PostCtrl', ['$scope', '$state', 'StatusService', function($scope, $state, StatusService) {
        $scope.charCount = 750;
        $scope.status = {
            content: '',
            statusPrivate: false
        };

        $scope.post = function() {
            StatusService.save($scope.status, function() {
                $scope.reset();
                $state.go('tab.timeline');
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
