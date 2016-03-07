'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.files', {
                parent: 'account',
                url: '/files',
                templateUrl: 'scripts/app/account/files/files.html',
                controller: 'FilesController'
            })
    });


