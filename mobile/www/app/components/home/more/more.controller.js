(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = [
        '$state',
        '$http',
        '$localStorage',
        '$ionicHistory',
        '$ionicPopup',
        'PathService',
        'TatamiEndpoint'
    ];
    function moreController($state, $http, $localStorage, $ionicHistory, $ionicPopup, PathService, TatamiEndpoint) {
        var vm = this;

        vm.endpoint = TatamiEndpoint.getEndpoint().url || TatamiEndpoint.getDefaultEndpoint().url;
        vm.attempted = false;
        vm.success = true;

        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;
        vm.goToSettings = goToSettings;
        vm.updateEndpoint = updateEndpoint;
        vm.isDefaultEndpoint = isDefaultEndpoint;
        vm.useDefaultEndpoint = useDefaultEndpoint;
        vm.goToBlockedUsers = goToBlockedUsers;

        function logout() {
            $localStorage.signOut();
            $ionicHistory.clearCache();
            vm.attempted = false;
            $state.go('login');
        }

        function goToCompanyTimeline() {
            $state.go('company');
        }

        function goToSettings() {
            $state.go('settings');
        }

        function goToBlockedUsers(){
            $state.go('blockedusers');
        }

        function updateEndpoint() {
            TatamiEndpoint.setEndpoint(vm.endpoint);
            $http({
                url: PathService.buildPath('/tatami/rest/client/id'),
                method: 'GET'
            }).then(success, error);
        }

        function success(result) {
            vm.success = true;
            vm.attempted = true;

            var alertPopup = $ionicPopup.alert({
                title: '<span translate="more.endpoint.authenticate.title"></span>',
                template: '<span translate="more.endpoint.authenticate.body"></span>'
            });

            alertPopup.then(vm.logout);
        }

        function error(result) {
            vm.success = false;
            vm.attempted = true;
            TatamiEndpoint.reset();
        }

        function isDefaultEndpoint() {
            return TatamiEndpoint.getEndpoint().url === vm.endpoint;
        }

        function useDefaultEndpoint() {
            vm.endpoint = TatamiEndpoint.getDefault().url;
            updateEndpoint();
        }
    }
})();
