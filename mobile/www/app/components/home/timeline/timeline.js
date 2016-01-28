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
                },
                resolve: {
                    lineItems: ['StatusService', function(StatusService) {
                        return StatusService.getHomeTimeline().$promise;
                    }]
                }
            })
            .state('tab.timeline-detail', {
                url: '/timeline/:lineItemId',
                views: {
                    'tab-timeline': {
                        templateUrl: 'app/components/timeline/timeline-detail.html',
                        controller: 'LineItemDetailCtrl'
                    }
                },
                resolve: {
                    lineItem: ['StatusService', '$stateParams', function(StatusService, $stateParams) {
                        return StatusService.get({ statusId : $stateParams.lineItemId }).$promise;
                    }]
                }
            });
    }
);
