(function() {
    'use strict';

    angular.module('tatami')
        .config(moreConfig);

    moreConfig.$inject = ['$stateProvider'];
    function moreConfig($stateProvider) {
        $stateProvider
            .state('more', {
                url: '/more',
                parent: 'home',
                views: {
                    'more': {
                        templateUrl: 'app/components/home/more/more.html',
                        controller: 'MoreController',
                        controllerAs: 'vm',
                        resolve: {
                            translatePartialProvider: getTranslatePartialProvider
                        }
                    }
                }
            });

        getTranslatePartialProvider.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialProvider($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('more');
            $translate.refresh();
        }
    }
})();
