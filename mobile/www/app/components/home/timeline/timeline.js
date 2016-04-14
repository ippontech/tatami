(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('timeline', {
                url: '/timeline',
                parent: 'home',
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

        getStatuses.$inject = ['StatusService'];
        function getStatuses(StatusService) {
            return StatusService.getHomeTimeline().$promise;
        }
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('timeline', 'home');
        TatamiState.addConversationState('timeline', 'home');
        TatamiState.addTagState('timeline', 'home');
    }

})();
