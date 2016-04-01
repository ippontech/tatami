'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('manage', {
                templateUrl: 'scripts/app/account/groups/manage/manage.html',
                //controller: 'GroupsManageController',

                parent: 'groups',
                url: '/:groupId',

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                },
                resolve: {
                    group : getGroup,
                    //members: getMembers
                }

            })
        getGroup.$inject = ['GroupService', '$stateParams'];
        function getGroup(GroupService, $stateParams) {
            return GroupService.get({groupId: $stateParams.groupId}).$promise;
        }
        getMembers.$inject = ['GroupService', '$stateParams'];
        function getMembers(GroupService, $stateParams) {
            return GroupService.getMembers({groupId: $stateParams.groupId}).$promise;

        }

    });
