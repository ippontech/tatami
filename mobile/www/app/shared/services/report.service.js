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

                if (statuses[i].geoLocalization) {
                    var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                    var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                    statuses[i]['locationURL'] =
                        'https://www.openstreetmap.org/?mlon='
                        + longitude + '&mlat=' + latitude;
                }
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
                    //params: {statusId: '@statusId'},
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
