(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('server', {
                url: '/server',
                parent: 'tatami',
                templateUrl: 'app/components/login/server/server.html',
                controller: 'ServerController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: getTranslatePartialLoader
                }
            });

        getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('server');
            $translate.refresh();
        }
    }
})();
