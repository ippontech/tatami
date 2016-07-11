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
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: getTranslatePartialLoader
                }
            });

        getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('more');
            return $translate.refresh();
        }
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('more', 'home');
    }
})();
