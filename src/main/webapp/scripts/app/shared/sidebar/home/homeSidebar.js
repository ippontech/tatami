'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
    console.log("in homeSidebar.js");
        $stateProvider
            .state('timeline', {
                parent: 'sidebarHome',
                url: '/timeline',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/shared/sidebar/home/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timelineHeader.html',
                        constroller: 'HomeSidebarController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/statusList.html',
                        controller: 'StatusListControllerTwo'
                    }
                },
                resolve: {
                    statuses: ['StatusService', function (StatusService) {
                        console.log("in resolve: statuses:");
                        return StatusService.getHomeTimeline().$promise;
                    }],
                    showModal: ['statuses', function (statuses) {
                        console.log("in showModal");
                        return statuses.length === 0;
                    }]
                }
            })
    });
