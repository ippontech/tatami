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
                    clientId: getClientId
                }
            });

        getClientId.$inject = ['$http', 'PathService'];
        function getClientId($http, PathService) {
            return $http({
                url: PathService.buildPath('/tatami/rest/client/id'),
                method: 'GET'
            });
        }
    }
})();
