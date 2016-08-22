'use strict';

tatamiJHipsterApp
    .config(function ($stateProvider) {
        $stateProvider
            .state('recommendedusers', {
                parent: 'listusers',
                url: '/recommended',

                views: {
                    'list': {
                        templateUrl: 'scripts/app/account/users/list/recommended/recommended.html',
                        controller: 'UsersRecommendedController'
                    }
                },

                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.users'
                },
                resolve: {
                    usersList: getSuggestions
                }
            })
            getSuggestions.$inject = ['UserService'];
            function getSuggestions(UserService) {
                return UserService.getSuggestions().$promise;
            }
    });
