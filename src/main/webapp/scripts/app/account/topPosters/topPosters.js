'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.topPosters', {
                parent: 'account',
                url: '/topPosters',
                templateUrl: 'scripts/app/account/topPosters/topPosters.html',
                controller: 'topPostersController'
            })
    });
