(function() {
    'use strict';
    var requestToken = "";
    var accessToken = "";
    var clientId = "260089373157-5a6n36mg1vgarq66ph3t58ipt70a5d3l.apps.googleusercontent.com";

    angular.module('tatami')
        .controller('LoginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$state', '$http', 'LoginService', '$localStorage'];
    function loginCtrl($scope, $state, $http, LoginService, $localStorage) {
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
                $state.go('timeline');
            }, function(failed) {
                vm.failed = true;
            })
        }

        function googleLogin() {
            var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');

            ref.addEventListener('loadstart', onStart);
            ref.addEventListener('exit', onExit);

            onStart.$inject = ['event'];
            function onStart(event) {
                if((event.url).startsWith("http://localhost/callback")) {
                    var requestToken = (event.url).split("code=")[1];

                    $http({
                        url: '/tatami/rest/oauth/token',
                        method: 'POST',
                        headers: {
                            'x-auth-token': requestToken
                        }
                    }).then(onSuccess, onFail);
                }
            }

            onExit.$inject = ['event'];
            function onExit(event) {
                $state.go('timeline');
            }

            onSuccess.$inject = ['result'];
            function onSuccess(result) {
                $localStorage.set('token', result.data);
                ref.close();
            }

            onFail.$inject = ['failure'];
            function onFail(failure) {
                console.log(failure);
            }
        }

        //function googleLogin() {
        //    var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost:8080/tatami/callback?client_name=Google2Client&scope=https://www.googleapis.com/auth/plus.login&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
        //    ref.addEventListener('loadstart', function(event) {
        //        if((event.url).startsWith("http://localhost/callback")) {
        //            requestToken = (event.url).split("code=")[1];
        //            $http({
        //                method: "post",
        //                url: "https://accounts.google.com/o/oauth2/token",
        //                data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost:8080/tatami/callback?client_name=Google2Client" + "&grant_type=authorization_code" + "&code=" + requestToken,
        //                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //            })
        //                .success(function(data) {
        //                    accessToken = data.access_token;
        //                    $state.go('tab.timeline');
        //                })
        //                .error(function(data, status) {
        //                    alert("ERROR: " + data);
        //                });
        //            ref.close();
        //        }
        //    });
        //}
        //
        //if (typeof String.prototype.startsWith != 'function') {
        //    String.prototype.startsWith = function (str){
        //        return this.indexOf(str) == 0;
        //    };
        //}
    }
})();
