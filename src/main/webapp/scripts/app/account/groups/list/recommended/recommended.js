'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('recommended', {


                parent: 'list',
                url: '/recommended',
                views: {
                    'recommended': {
                        templateUrl: 'scripts/app/account/groups/list/recommended/recommended.html',
                        controller: 'GroupsListRecommendedController'
                    }
                },
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.groups'
                },
                resolve: {
                    userGroups: getRecommended
                }
            })
            getRecommended.$inject = ['GroupService'];
            function getRecommended(GroupService) {
                return GroupService.getRecommendations().$promise;
            }
    });
