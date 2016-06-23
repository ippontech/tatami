'use strict';


angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                //   abstract: true,
                parent: 'site',
                url: '/login',
                data: {
                    authorities: [],
                    pageTitle: 'login.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/login/login.html',
                        controller: 'LoginController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                    //clientId: getClientId
                }
            });

        /*getClientId.$inject = ['$http'];
        function getClientId($http) {
            return $http({
                url:'/tatami/rest/client/id',
                method: 'GET'
            })
        }*/

});
