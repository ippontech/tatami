(function() {
    'use strict';

    angular.module('tatami')
        .controller('LoginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', '$state', '$http', '$localStorage', 'clientId', 'LoginService', 'PathService'];
    function loginCtrl($scope, $state, $http, $localStorage, clientId, LoginService, PathService) {
        var vm = this;
        vm.clientId = clientId.data.stringList[0];
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
            var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + vm.clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.me&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');

            ref.addEventListener('loadstart', onStart);

            onStart.$inject = ['event'];
            function onStart(event) {
                if((event.url).startsWith("http://localhost/callback")) {
                    var requestToken = (event.url).split("code=")[1];

                    $http({
                        url: PathService.buildPath('/tatami/rest/oauth/token'),
                        method: 'POST',
                        headers: {
                            'x-auth-token': requestToken
                        }
                    }).then(onSuccess, onFail);
                }
            }

            onSuccess.$inject = ['result'];
            function onSuccess(result) {
                $localStorage.set('token', result.data);
                ref.close();
                $state.go('timeline');
            }

            onFail.$inject = ['failure'];
            function onFail(failure) {
                ref.close();
                vm.failed = true;
            }
        }
    }
})();
