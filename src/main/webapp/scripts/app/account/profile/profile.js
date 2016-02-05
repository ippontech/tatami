'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider


            .state('profile', {
                parent: 'account',
                url: '/profile',

                templateUrl: 'scripts/app/account/profile/profile.html',
                resolve: {
                    userLogin: ['UserService', 'profileInfo', function(UserService, profileInfo) {
                        console.log(profileInfo);
                        console.log(profileInfo.login);
                        return UserService.get({ username: profileInfo.data.login }).$promise;

                    }]
                },
                controller: 'ProfileController'

            })

    });
