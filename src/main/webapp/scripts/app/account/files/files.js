'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account.files', {
                parent: 'account',
                url: '/files',
                templateUrl: 'scripts/app/account/files/files.html',
                resolve: {
                    FilesService: 'FilesService',
                    attachmentQuota: function(FilesService) {
                        return FilesService.getQuota().$promise;
                    },

                    fileList: function(FilesService) {
                        return FilesService.query().$promise;
                    }
                },
                controller: 'FilesController'
            })
    });
