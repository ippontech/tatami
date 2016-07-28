(function () {
    'use strict';

    angular.module('tatami')
        .controller('LoginCtrl', loginCtrl);

    loginCtrl.$inject = [
        'TatamiEndpoint',
        '$scope',
        '$state',
        '$http',
        '$localStorage',
        '$ionicLoading',
        'PathService',
        '$ionicHistory',
        'ToastService'
    ];
    function loginCtrl(TatamiEndpoint, $scope, $state, $http, $localStorage, $ionicLoading, PathService, $ionicHistory, ToastService) {

        var vm = this;

        $scope.$on("$ionicView.enter", function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            var newEndpoint = TatamiEndpoint.getEndpoint();
            if (vm.lastEndpoint.url !== newEndpoint.url) {
                vm.lastEndpoint.url = newEndpoint.url;
                vm.failed = false;
            }
        });

        vm.user = {
            remember: false
        };
        vm.failed = false;
        vm.login = login;
        vm.tryGoogleLogin = tryGoogleLogin;
        vm.goToServerConfig = goToServerConfig;
        vm.lastEndpoint = {url: ''};

        function login() {
            var data = "j_username=" + encodeURIComponent(vm.user.email) + "&j_password="
                + encodeURIComponent(vm.user.password);
            return $http.post(PathService.buildPath('/tatami/rest/authentication'), data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            }).success(function (data) {
                $localStorage.set('token', data.token);
                vm.user = {remember: false};
                $state.go('timeline');
            }).error(function () {
                vm.failed = true;
            });
        }

        function tryGoogleLogin() {
            $http({
                url: PathService.buildPath('/tatami/rest/client/id'),
                method: 'GET'
            }).then(function (data) {
                var clientId;
                if (data && data.data && data.data.stringList) {
                    // Old tatami return the clientId in the stringList property
                    clientId = data.data.stringList[0];
                } else if (data && data.data && data.data.clientId) {
                    clientId = data.data.clientId;
                }

                // Do Google login or display an error message
                if (clientId) {
                    googleLogin(clientId);
                } else {
                    ToastService.display('login.googleUnavaible');
                }
            }, function () {
                ToastService.display('login.googleUnavaible');
            });
        }

        function googleLogin(clientId) {
            var emailScope = 'https://www.googleapis.com/auth/plus.profile.emails.read';
            var profileScope = 'https://www.googleapis.com/auth/plus.me';
            var googleUrl = 'https://accounts.google.com/o/oauth2/auth?' +
                'client_id=' + clientId + '&' +
                'redirect_uri=http://localhost/callback&' +
                'scope=' + emailScope + ' ' + profileScope + '&' +
                'approval_prompt=force&response_type=code&access_type=offline';

            var ref = window.open(googleUrl, '_blank', 'location=no');

            ref.addEventListener('loadstart', onStart);

            onStart.$inject = ['event'];
            function onStart(event) {
                if (event.url.indexOf('http://localhost/callback') === 0) {
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
            function onFail() {
                vm.failed = true;
            }
        }

        function goToServerConfig() {
            $state.go('server');
        }
    }
})();
