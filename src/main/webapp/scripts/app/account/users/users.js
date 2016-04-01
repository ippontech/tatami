'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.users', {
                parent: 'account',
                url: '/users',
                templateUrl: 'scripts/app/account/users/users.html'

            })
    });


