(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(profileStatusesConfig);

    profileStatusesConfig.$inject = ['$stateProvider'];
    function profileStatusesConfig($stateProvider) {
        $stateProvider
        .state('profileFollowers', {
            url: '/followers',
            views: {
                'homeSide@timelineHome': {
                    templateUrl: 'scripts/app/home/profile/sidebar/profileSidebar.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@timelineHome': {
                    templateUrl: 'scripts/app/home/profile/profileHeader.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'scripts/app/shared/lists/user/userList.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                users: ['UserService', '$stateParams', function (UserService, $stateParams) {
                    return UserService.getFollowers({email: $stateParams.email}).$promise;
                }]
            }
        })
    }
})();
