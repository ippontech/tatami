angular.module('tatami')
    .config(function ($stateProvider) {

        $stateProvider
            .state('timeline', {
                url: '/timeline',
                parent: 'home',
                views: {
                    'timeline': {
                        templateUrl: 'app/components/home/timeline/timeline.html',
                        controller: 'TimelineCtrl'
                    }
                },
                resolve: {
                    lineItems: ['StatusService', function(StatusService) {
                        return StatusService.getHomeTimeline().$promise;
                    }]
                }
            })
            .state('timeline-detail', {
                url: '/timeline/:lineItemId',
                parent: 'home',
                views: {
                    'timeline': {
                        templateUrl: 'app/components/home/timeline/timeline-detail.html',
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
