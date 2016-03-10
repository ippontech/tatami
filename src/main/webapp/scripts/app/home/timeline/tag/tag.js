(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(tagConfig);

    tagConfig.$inject = ['$stateProvider'];
    function tagConfig($stateProvider) {
        $stateProvider
        .state('tag', {
            parent: 'sidebarHome',
            url: '/tag/:tag',
            views: {
                'homeSide@timelineHome': {
                    templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@timelineHome': {
                    templateUrl: 'scripts/app/home/timeline/tag/tagHeader.html',
                    controller: 'TagHeaderController'
                },
                'homeBodyContent@timelineHome': {
                    templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                tag: ['TagService', '$stateParams', function (TagService, $stateParams) {
                    return TagService.get({tag: $stateParams.tag}).$promise;
                }],
                statuses: ['TagService', '$stateParams', function (TagService, $stateParams) {
                    return TagService.getTagTimeline({tag: $stateParams.tag}).$promise;
                    }]
                }
            })
        }
})();
