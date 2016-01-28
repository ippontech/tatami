(function() {
    'use strict';

    angular.module('tatami')
        .config(homeConfig);

    homeConfig.$inject = ['$stateProvider'];
    function homeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'tatami',
                abstract: true,
                url: '/home',
                templateUrl: 'app/components/home/home.html'
            })
    }
})();
