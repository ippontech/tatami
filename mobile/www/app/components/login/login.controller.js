(function () {
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
        'PathService',
        '$ionicHistory'
    ];
    function loginCtrl($scope, $state, $http, $localStorage, $ionicLoading, clientId, PathService, $ionicHistory) {

        var vm = this;

        $scope.$on("$ionicView.enter", function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        });

        if (clientId && clientId.data && clientId.data.stringList) {
            // Old tatami return the clientId in the stringList property
            vm.clientId = clientId.data.stringList[0];
        } else if (clientId && clientId.data && clientId.data.clientId) {
            vm.clientId = clientId.data.clientId;
        }
        vm.user = {
            remember: false
        };
        vm.failed = false;
        vm.login = login;
        vm.googleLogin = googleLogin;
        vm.goToServerConfig = goToServerConfig;

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
