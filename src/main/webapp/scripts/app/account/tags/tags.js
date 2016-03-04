'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.tags', {
                parent: 'account',
                url: '/tags',
                templateUrl: 'scripts/app/account/tags/tags.html',
                controller: 'tagsController'
            })
    });
