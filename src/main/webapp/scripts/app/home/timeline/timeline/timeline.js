'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('timeline', {
                parent: 'sidebarHome',
                url: '/timeline',
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
                        templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                        controller: 'StatusListController'
                    }
                },
                resolve: {
                    statuses: ['StatusService', function (StatusService) {
                        return StatusService.getHomeTimeline().$promise;
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }]
                }
            })
            .state('statuses', {
                            parent: 'sidebarHome',
                            url: '/timeline/:username',
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
                                    templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                                    controller: 'StatusListController'
                                }
                            },
                            resolve: {
                                statuses: ['StatusService','$stateParams', function (StatusService,$stateParams) {
                                    return StatusService.getUserTimeline($stateParams).$promise;
                                }],
                                showModal: ['statuses', function (statuses) {
                                    return statuses.length === 0;
                                }]
                            }
                        });
    });
