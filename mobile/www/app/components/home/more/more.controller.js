(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = [
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
    function moreController($scope, $state, $http, $localStorage, $ionicHistory, $translate, $ionicPopup, PathService, TatamiEndpoint) {
        var vm = this;

        vm.endpoint = TatamiEndpoint.getEndpoint().url || TatamiEndpoint.getDefaultEndpoint().url;
        vm.attempted = false;
        vm.success = true;

        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;
        vm.updateEndpoint = updateEndpoint;
        vm.isDefaultEndpoint = isDefaultEndpoint;
        vm.useDefaultEndpoint = useDefaultEndpoint;

        vm.language = window.localStorage.getItem('language');

        vm.languages = [
            {
                langKey: 'en',
                translateKey: 'more.language.english'
            },
            {
                langKey: 'fr',
                translateKey: 'more.language.french'
            }
        ];

        $scope.$watch('vm.language', updateLanguage);

        function updateLanguage(language) {
            $translate.use(language);
            window.localStorage.setItem('language', language);
        }


        function logout() {
            $localStorage.signOut();
            $ionicHistory.clearCache();
            vm.attempted = false;
            $state.go('login');
        }

        function goToCompanyTimeline() {
            $state.go('company');
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
