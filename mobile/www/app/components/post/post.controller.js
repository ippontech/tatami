angular.module('tatami')
    .controller('PostCtrl', ['$scope', 'StatusService', function($scope, StatusService) {
        $scope.charCount = 750;
        $scope.status = {
            content: ''
        };

        $scope.post = function() {
            console.log($scope.status);
            StatusService.save($scope.status, function() {
                $scope.go('tab.timeline');
            })
        };

        //$scope.post = function(newPost) {
        //    console.log(newPost);
        //}
    }]
);
