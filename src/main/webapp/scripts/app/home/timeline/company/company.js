'use strict';
angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('company', {
                parent: 'sidebarHome',
                url: '/company',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/timelineHeader.html',
                        controller: 'HomeController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/content.html',
                        controller: 'TimelineController'
                    }
                },
                resolve: {
                    statuses: ['StatusService', function (StatusService) {
                        return StatusService.getCompanyTimeline().$promise;
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }]
                }
            })
    });
