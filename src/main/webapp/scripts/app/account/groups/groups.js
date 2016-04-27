'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('groups', {
                abstract: true,
                template: '<ui-view></ui-view>',
                controller: 'GroupsController',

                parent: 'account',
                url: '/groups',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                },
                resolve: {
                    username: getUsername
                }
            })
            getUsername.$inject = ['AccountService'];
                        function getUsername(AccountService) {
                            return AccountService.get().$promise;
                        }

    });
