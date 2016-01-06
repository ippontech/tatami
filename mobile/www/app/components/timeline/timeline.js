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
            })
            .state('tab.timeline-detail', {
                url: '/timeline/:lineItemId',
                views: {
                    'tab-timeline': {
                        templateUrl: 'app/components/timeline/timeline-detail.html',
                        controller: 'LineItemDetailCtrl'
                    }
                }
            });
    }
);
