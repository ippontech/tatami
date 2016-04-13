'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
        .state('account.tags', {
            url:'/tags',
            templateUrl: 'scripts/app/account/form.html',
            controller: 'FormController'
        })
    });
