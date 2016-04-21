'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('following', {
                parent: 'listusers',
                url: '/following',

                views: {
                    'list': {
                        templateUrl: 'scripts/app/account/users/list/following/following.html',
                        controller: 'UsersFollowingController'
                    }
                },

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.users'
                },
                resolve: {
                    usersList: getFollowings
                }
            })
            getFollowings.$inject = ['UserService','profileInfo'];
            function getFollowings(UserService,profileInfo) {
                return UserService.getFollowing({ email: profileInfo.data.email }).$promise;
            }
    });
