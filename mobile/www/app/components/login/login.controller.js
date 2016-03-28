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
            var emailScope = 'https://www.googleapis.com/auth/plus.profile.emails.read';
            var profileScope = 'https://www.googleapis.com/auth/plus.me';
            var googleUrl = 'https://accounts.google.com/o/oauth2/auth?' +
                            'client_id=' + vm.clientId + '&' +
                            'redirect_uri=http://localhost/callback&' +
                            'scope=' + emailScope + ' ' + profileScope + '&' +
                            'approval_prompt=force&response_type=code&access_type=offline';

            var ref = window.open(googleUrl, '_blank', 'location=no');

            ref.addEventListener('loadstart', onStart);

            onStart.$inject = ['event'];
            function onStart(event) {
                if((event.url).indexOf('http://localhost/callback') == 0) {
                    var requestToken = (event.url).split("code=")[1];
                    $http({
                        url: PathService.buildPath('/tatami/rest/oauth/token'),
                        method: 'POST',
                        headers: {
                            'x-auth-code-header': requestToken
                        }
                    }).then(onSuccess, onFail);
                }
            }

            onSuccess.$inject = ['result'];
            function onSuccess(result) {
                $localStorage.set('token', result.data.token);
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
