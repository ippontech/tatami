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
                    clientId: getClientId,
                    translatePartialLoader: getTranslatePartialLoader
                }
            });

        getClientId.$inject = ['$http', 'PathService'];
        function getClientId($http, PathService) {
            return $http({
                url: PathService.buildPath('/tatami/rest/client/id'),
                method: 'GET'
            }).catch(function(error) {
            });
        }

        getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('login');
            return $translate.refresh();
        }
    }
})();
