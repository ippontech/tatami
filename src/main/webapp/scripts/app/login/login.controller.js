'use strict';

angular.module('tatamiJHipsterApp')
    .controller('LoginController', function ($rootScope, $window, $scope, $state, $timeout, Auth, Principal) {
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
                    $state.go('login');
                } else {
                    $state.isAdmin = Principal.hasAnyAuthority(["ROLE_ADMIN"]);
                    $state.go('timeline');
                }
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };
        $scope.registerUser = function(){
            $state.go('register');
        };
        $scope.resetPassword = function() {
            Auth.resetPasswordInit($scope.user.email)
        };
        $scope.googleLogin = function() {
            $window.location.href = '/tatami/rest/builder';
        };
            if (typeof String.prototype.startsWith != 'function') {
                String.prototype.startsWith = function (str) {
                    return this.indexOf(str) == 0;
                };
            }

    });
