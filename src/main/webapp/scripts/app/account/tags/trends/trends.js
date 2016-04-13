'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
        .state('trends', {
            parent: 'account.tags',
            url: '/trends',
            templateUrl: 'scripts/app/account/tags/tags.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.getPopular().$promise;
                }]
            },
            controller: 'TagsController'
        })
    });
