'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.groups', {
                parent: 'account',
                url: '/groups',

                templateUrl: 'scripts/app/account/groups/groups.html',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                },
                controller: 'GroupsController'

            })

    });
