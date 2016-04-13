'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
        .state('trendSearch', {
            parent: 'account',
            url: '/tags/trendSearch/:q',
            templateUrl: 'scripts/app/account/tags/tags.html',
            resolve: {
                tagList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    if($stateParams.q.length === 0) {
                        return {};
                    }
                    else {
                        return SearchService.query({ term: 'tags', q: $stateParams.q }).$promise;
                    }
                }]
            },
            controller: 'TagsController'
        })
    });
