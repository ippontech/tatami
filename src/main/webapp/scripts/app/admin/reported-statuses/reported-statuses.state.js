'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('reported', {
                parent: 'sidebarHome',
                url: '^/reported-statuses',
                abstract: true,
                resolve: {
                    //group: getGroup,
                    showModal: function () {
                        return false;
                    }
                }
            })
            .state('reported-statuses', {
                parent: 'reported',
                url: '/reported-statuses',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'reported-statuses.home.title'
                },
                views: {
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/admin/reported-statuses/reported-statuses.html',
                        controller: 'ReportedStatusesController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/content.html',
                        controller: 'TimelineController'
                    }
                },
                resolve: {
                    statuses: ['ReportService', function (ReportService) {
                        return ReportService.getReportedStatuses({}).$promise
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('reported.statuses');
                        return $translate.refresh();
                    }]
                }
            })
    });
