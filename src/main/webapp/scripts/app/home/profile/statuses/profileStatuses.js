(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(profileStatusesConfig);

    profileStatusesConfig.$inject = ['$stateProvider'];
    function profileStatusesConfig($stateProvider) {
        $stateProvider
        .state('profileStatuses', {
            parent: 'otherUserProfile',
            url: '/statuses',
            views: {
                'homeSide@timelineHome': {
                    templateUrl: 'scripts/app/home/profile/sidebar/profileSidebar.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@timelineHome': {
                    templateUrl: 'scripts/app/home/profile/profileHeader.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@timelineHome': {
                    templateUrl: 'scripts/app/home/timeline/statuslist/statusList.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', '$stateParams', function (StatusService, $stateParams) {
                    return StatusService.getUserTimeline({email: $stateParams.email}).$promise;
                }],
                showModal: function () {
                    return false;
                }
            }
        })
        }
})();
