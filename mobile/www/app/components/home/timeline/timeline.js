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
            .state('timeline.detail', {
                url: '/detail/:statusId',
                views: {
                    'timeline@home': {
                        templateUrl: 'app/components/home/timeline/detail.html',
                        controller: 'TimelineDetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    status: ['StatusService', '$stateParams', function(StatusService, $stateParams) {
                        return StatusService.get({ statusId : $stateParams.statusId }).$promise;
                    }]
                }
            });
    }
);
