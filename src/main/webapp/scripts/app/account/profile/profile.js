'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile', {
                parent: 'account',
                url: '/profile',

                templateUrl: 'scripts/app/account/profile/profile.html',
                resolve: {
                    userLogin: ['User', 'profileInfo', function(User, profileInfo) {
//                        console.log(profileInfo);
//                        console.log(profileInfo.data.login);
//                        return User.get({ username: profileInfo.data.login }).$promise;
                            return profileInfo.data;
                    }]
                },
                controller: 'ProfileController'

            })

    });
