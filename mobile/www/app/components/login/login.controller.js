angular.module('tatami')
    .controller('LoginController', ['$scope', '$state', 'ProfileService', '$http', function($scope, $state, ProfileService, $http) {
        $scope.user = {};
        $scope.shown = false;
        $scope.failed = false;

        $scope.login = function() {
            //$http({
            //    method: 'POST',
            //    url: '/tatami/authentication',
            //    transformRequest: function(obj) {
            //        var str = [];
            //        for(var p in obj)
            //            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //        return str.join("&");
            //    },
            //    data: { j_username: $scope.user.email, j_password: $scope.user.password, _spring_security_remember_me: $scope.user.remember },
            //    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            //}).success(function(data) {
            //    $scope.shown = true;
            //    console.log(data);
            //    $state.go('tab.dash');
            //}).error(function(err) {
            //    $scope.failed = true;
            //    console.log(err);
            //});
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
