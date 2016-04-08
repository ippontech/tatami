'use strict';

tatamiJHipsterApp
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth, Principal) {
        $scope.user = {};
        $scope.errors = {};

        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    $state.isAdmin = Principal.hasAnyAuthority(["ROLE_ADMIN"]);
                    $state.go('timeline');
                }
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };
        $scope.registerUser = function(){
          var data = 'email' + $scope.user.email;
            $state.go('register');
        };
        $scope.resetPassword = function() {
            Auth.resetPasswordInit($scope.user.email)
        };
    });
