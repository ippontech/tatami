FilesModule.factory('FilesService', function($resource) {
    return $resource(
        '/tatami/rest/attachments/:attachmentId',
        { },
        {
            'getQuota': { method: 'GET', isArray: true, url: '/tatami/rest/attachments/quota' }
        });
});