(function() {
    'use strict';


    angular.module('tatamiJHipsterApp')
        .config(topPostersConfig);


    topPostersConfig.$inject = ['$stateProvider'];
    function topPostersConfig($stateProvider) {
        $stateProvider
            .state('account.topPosters', {
                parent: 'account',
                url: '/topPosters',
                templateUrl: 'scripts/app/account/topPosters/topPosters.html',
                controller: 'TopPostersController',
                controllerAs: 'vm'
            })
    }

})();



