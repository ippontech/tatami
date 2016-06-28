/**
 * Created by emilyklein on 6/23/16.
 */
(function () {
    'use strict';

    angular.module('tatamiJHipsterApp')
        .config(groupConfig);

    groupConfig.$inject = ['$stateProvider'];
    function groupConfig($stateProvider) {
        $stateProvider
        //state for all views that use home sidebar
            .state('group', {
                parent: 'sidebarHome',
                url: '^/group/:groupId',
                abstract: true,
                resolve: {
                    group: getGroup,
                    showModal: function () {
                        return false;
                    }
                }
            })
            .state('members', {
                parent: 'group',
                url: '/members',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/group/groupHeader.html',
                        controller: 'GroupStatusesController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/shared/lists/user/userList.html',
                        controller: 'UserListController'
                    }
                },
                resolve: {
                    users: ['GroupService', '$stateParams', function (GroupService, $stateParams) {
                        return GroupService.getMembers({groupId: $stateParams.groupId}).$promise
                    }],
                    showModal: ['users', function (users) {
                        return users.length === 0;
                    }]

                }
            })
            .state('groupStatus', {
                parent: 'group',
                url: '/statuses',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/group/groupHeader.html',
                        controller: 'GroupStatusesController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/timeline/content.html',
                        controller: 'TimelineController'
                    }
                },
                resolve: {
                    statuses: ['GroupService', '$stateParams', function (GroupService, $stateParams) {
                        return GroupService.getStatuses({groupId: $stateParams.groupId}).$promise
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }]
                }
            })
            .state('privateGroup', {
                parent: 'group',
                url: '/restricted',
                views: {
                    'homeSide@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/sidebar/homeSidebar.html',
                        controller: 'HomeSidebarController'
                    },
                    'homeBodyHeader@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/group/groupHeader.html',
                        controller: 'GroupStatusesController'
                    },
                    'homeBodyContent@timelineHome': {
                        templateUrl: 'scripts/app/home/timeline/group/privateGroupWarning.html',
                        controller: 'TimelineController'
                    }
                },
                resolve: {
                    statuses: ['GroupService', '$stateParams', function (GroupService, $stateParams) {
                        return GroupService.getStatuses({groupId: $stateParams.groupId}).$promise
                    }],
                    showModal: ['statuses', function (statuses) {
                        return statuses.length === 0;
                    }]
                }
            })
    }

    getGroup.$inject = ['$stateParams', 'GroupService'];
    function getGroup($stateParams, GroupService) {
        return GroupService.get({groupId: $stateParams.groupId}).$promise;
    }

})();
