angular.module('tatami')
    .controller('TimelineCtrl', function ($scope, LineItems, $http) {

        $scope.lineItems = LineItems.all();
        $scope.lineItems.success(function(data) {
            $scope.lineItems = data;
        });
        $scope.remove = function (lineItem) {
            LineItems.remove(lineItem);
        };

        $scope.getAvatarURL = function(avatar) {
            var src = '../../../img/test-prof.png';
            if( avatar != '' &&  avatar != undefined) {
                src = '/tatami/avatar/' + avatar + '/photo.jpg';
            }
            return src;
        };
    });
