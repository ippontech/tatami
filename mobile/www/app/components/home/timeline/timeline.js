(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider', 'StatusStateProvider'];
    function config($stateProvider, StatusStateProvider) {

        $stateProvider
            .state('timeline', {
                url: '/timeline',
                parent: 'home',
                cache: false,
                views: {
                    'timeline': {
                        templateUrl: 'app/components/home/timeline/timeline.html',
                        controller: 'TimelineCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    statuses: getStatuses
                }
            });
            //.state('timeline.detail', StatusState.getProfileState('timeline', 'home'));

        getStatuses.$inject = ['StatusService'];
        function getStatuses(StatusService) {
            return StatusService.getHomeTimeline().$promise;
        }
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['StatusState'];
    function run(StatusState) {
        StatusState.addStatusState('timeline', 'home');
        StatusState.addStatusState('mentions', 'home');
        StatusState.addStatusState('favorites', 'home');
    }

})();
