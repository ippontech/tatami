angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab.timeline', {
                url: '/timeline',
                views: {
                    'tab-timeline': {
                        templateUrl: 'app/components/timeline/tab-timeline.html',
                        controller: 'TimelineCtrl'
                    }
                }
            }
        );
    }
);
