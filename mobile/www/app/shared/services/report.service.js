(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('ReportService', reportService);

    reportService.$inject = ['$resource', 'PathService'];
    function reportService($resource, PathService) {

        var responseTransform = function (statuses) {
            statuses = angular.fromJson(statuses);

            for (var i = 0; i < statuses.length; i++) {
                statuses[i]['avatarURL'] = PathService.getAvatar(statuses[i]);

            }

            return statuses;
        };

        return $resource(PathService.buildPath('/tatami/rest/statuses/report/:statusId'), null,
            {
                'reportStatus': {
                    method: 'POST',
                    params: {statusId: '@statusId'}
                },
                'getReportedStatuses': {
                    method: 'GET',
                    isArray: true,
                    url: PathService.buildPath('/tatami/rest/statuses/reportedList'),
                    transformResponse: responseTransform
                },
                'approveStatus': {
                    method : 'DELETE',
                    params: {statusId: '@statusId'}
                },
                'deleteStatus': {
                    method: 'PUT',
                    params: {statusId: '@statusId'}
                }
            });
    }
})();
