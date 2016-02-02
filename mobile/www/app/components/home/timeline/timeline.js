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
            })
            .state('timeline.detail', {
                url: '/detail/:statusId',
                views: {
                    'timeline@home': {
                        templateUrl: 'app/components/home/detail/detail.html',
                        controller: 'DetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    status: getStatus
                }
            });

        getStatuses.$inject = ['StatusService'];
        function getStatuses(StatusService) {
            return StatusService.getHomeTimeline().$promise;
        }

        getStatus.$inject = ['StatusService', '$stateParams'];
        function getStatus(StatusService, $stateParams) {
            return StatusService.get({ statusId : $stateParams.statusId }).$promise;
        }
    }
})();
