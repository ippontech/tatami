'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider


            .state('profile', {
                parent: 'account' ,
                url: '/profile',

                templateUrl: 'scripts/app/account/profile/profile.html'


            })
    });
