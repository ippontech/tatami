(function() {
    'use strict';

    angular.module('tatami')
        .controller('LoginCtrl', loginCtrl);

    loginCtrl.$inject = [
        '$scope',
        '$state',
        '$http',
        '$localStorage',
        '$ionicLoading',
        'clientId',
        'LoginService',
        'PathService'];
    function loginCtrl($scope, $state, $http, $localStorage, $ionicLoading, clientId, LoginService, PathService) {

        var vm = this;

        if (clientId.data && clientId.data.stringList) {
            // Old tatami return the clientId in the stringList property
            vm.clientId = clientId.data.stringList[0];
        } else if (clientId.data && clientId.data.clientId) {
            vm.clientId = clientId.data.clientId;
        }
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
                if(success && success.data && success.data.token) {
                    $localStorage.set('token', success.data.token);
                }
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
                if(event.url.indexOf('http://localhost/callback') === 0) {
                    ref.close();
                    $ionicLoading.show({
                        template: '<span translate="login.progress">Login in progress...</span>',
                        hideOnStateChange: true
                    });
                    var requestToken = event.url.split("code=")[1];
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
                $state.go('timeline');
            }

            onFail.$inject = ['failure'];
            function onFail(failure) {
                vm.failed = true;
            }
        }
    }
})();
