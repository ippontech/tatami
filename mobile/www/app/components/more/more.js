(function() {
    'use strict';

    angular.module('tatami')
        .config(moreConfig);

    moreConfig.$inject = ['$stateProvider'];
    function moreConfig($stateProvider) {
        $stateProvider
            .state('tab.more', {
                url: '/more',
                views: {
                    'tab-more': {
                        templateUrl: 'app/components/more/more.html',
                        controller: 'MoreController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();
