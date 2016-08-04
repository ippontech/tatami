'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('blockedusers', {
                parent: 'listusers',
                url: '/blockedUsers',

                views: {
                    'list': {
                        templateUrl: 'scripts/app/account/users/list/blocked/blocked.users.html',
                        controller: 'BlockedUsersController'
                    }
                },

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.users'
                },
                resolve: {
                    usersList: getBlocked
                }
            });
            getBlocked.$inject = ['BlockService','profileInfo'];
            function getBlocked(BlockService,profileInfo) {
                return BlockService.getBlockedUsersForUser({ email: profileInfo.data.email }).$promise;
            }
    });
