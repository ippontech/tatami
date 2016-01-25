(function() {
    'use strict';
    var requestToken = "";
    var accessToken = "";
    var clientId = "532238149370-40jujaon5evfgggvbeiocrcheaml6c4u.apps.googleusercontent.com";
    var clientSecret = "xFy65VlyGAcKz_QQoDVmoSDx";

    angular.module('tatami')
        .controller('LoginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$state', 'LoginService'];
    function loginCtrl($scope, $state, LoginService) {
        var vm = this;
        vm.user = {
            remember: false
        };
        vm.shown = false;
        vm.failed = false;
        vm.login = login;
        vm.googleLogin = googleLogin;

        function login() {
            LoginService.login({
                j_username: vm.user.email,
                j_password: vm.user.password,
                _spring_security_remember_me: vm.user.remember
            }, function(success) {
                vm.user = { remember: false };
                $state.go('tab.timeline');
            }, function(failed) {
                vm.failed = true;
            })
        }

        function googleLogin() {
            var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost:8080/tatami/callback?client_name=Google2Client&scope=https://www.googleapis.com/auth/plus.login&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
            ref.addEventListener('loadstart', function(event) {
                if((event.url).startsWith("http://localhost/callback")) {
                    requestToken = (event.url).split("code=")[1];
                    $http({
                        method: "post",
                        url: "https://accounts.google.com/o/oauth2/token",
                        data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost:8080/tatami/callback?client_name=Google2Client" + "&grant_type=authorization_code" + "&code=" + requestToken,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                        .success(function(data) {
                            accessToken = data.access_token;
                            $state.go('tab.timeline');
                        })
                        .error(function(data, status) {
                            alert("ERROR: " + data);
                        });
                    ref.close();
                }
            });
        }

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str){
                return this.indexOf(str) == 0;
            };
        }
    }
})();
