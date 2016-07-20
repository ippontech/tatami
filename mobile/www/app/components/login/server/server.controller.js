(function() {
    'use strict';

    angular.module('tatami')
        .controller('ServerController', serverController);

    serverController.$inject = [
        '$scope',
        '$state',
        '$http',
        '$localStorage',
        '$ionicHistory',
        '$translate',
        '$ionicPopup',
        'PathService',
        'TatamiEndpoint'
    ];
    function serverController($scope, $state, $http, $localStorage, $ionicHistory, $translate, $ionicPopup, PathService, TatamiEndpoint) {
        var vm = this;

        vm.endpoint = TatamiEndpoint.getEndpoint().url || TatamiEndpoint.getDefault().url;
        vm.success = true;
        vm.previous = vm.endpoint;

        vm.updateEndpoint = updateEndpoint;
        vm.useDefaultEndpoint = useDefaultEndpoint;
        vm.isLastAttempt = isLastAttempt;

        function updateEndpoint() {
            TatamiEndpoint.setEndpoint(vm.endpoint);
            $http({
                url: PathService.buildPath('/tatami/rest/client/id'),
                method: 'GET'
            }).then(success, error);
        }

        function success(result) {
            vm.success = true;
            vm.previous = vm.endpoint;

            var alertPopup = $ionicPopup.alert({
                title: $translate.instant('server.endpoint.authenticate.title'),
                template: '<span translate="server.endpoint.authenticate.body"></span>'
            });

            alertPopup.then($state.go('login'));
        }

        function error(result) {
            vm.success = false;
            vm.previous = vm.endpoint;

            $ionicPopup.alert({
                title: $translate.instant('server.endpoint.error.title'),
                template: '<span translate="server.endpoint.error.body"></span>'
            });

            TatamiEndpoint.reset();
        }

        function isLastAttempt() {
            return vm.previous === vm.endpoint;
        }

        function useDefaultEndpoint() {
            vm.endpoint = TatamiEndpoint.getDefault().url;
            updateEndpoint();
        }
    }
})();
