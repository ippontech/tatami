(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(profileStatusesConfig);

    profileStatusesConfig.$inject = ['$stateProvider'];
    function profileStatusesConfig($stateProvider) {
        $stateProvider
        .state('profileFollowing', {
            parent: 'otherUserProfile',
            url: '/following',
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
                    templateUrl: 'scripts/shared/lists/user/userList.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                users: ['UserService', '$stateParams', function (UserService, $stateParams) {
                    return UserService.getFollowing({email: $stateParams.email}).$promise;
                }]
            }
        })
    }
})();
