'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
        .state('tagsFollowing', {
            parent: 'account',
            url: '/tags/following',
            templateUrl: 'scripts/app/account/tags/tags.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.query().$promise;
                }]
            },
            controller: 'TagsController'
        })
    });
