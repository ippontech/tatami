'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('mine', {
                parent: 'list',
                url: '/mine',

                views: {
                    'list': {
                        templateUrl: 'scripts/app/account/groups/list/mine/mine.html',
                        controller: 'GroupsListMineController'
                    }
                },

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                },
                resolve: {
                    userGroups: getGroups
                }
            })
            getGroups.$inject = ['GroupService'];
            function getGroups(GroupService) {
                return GroupService.getGroups().$promise;
            }
    });
