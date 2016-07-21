(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                parent: 'tatami',
                templateUrl: 'app/components/login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: getTranslatePartialLoader
                }
            });

        getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('login');
            return $translate.refresh();
        }
    }
})();
