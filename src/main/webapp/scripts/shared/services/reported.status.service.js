(function() {
    'use strict';

    angular.module('tatamiJHipsterApp')
        .factory('ReportService', reportService);

    reportService.$inject = ['$resource'];
    function reportService($resource) {
        var responseTransform = function (statuses) {
            statuses = angular.fromJson(statuses);

            for (var i = 0; i < statuses.length; i++) {
                statuses[i]['avatarURL'] = !statuses[i].avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
            }
            return statuses;
        };

        return $resource('/tatami/rest/statuses/report/:statusId', null,
            {
                'reportStatus': {
                    method: 'POST',
                    params: {statusId: '@statusId'}
                },
                'getReportedStatuses': {
                    method: 'GET',
                    isArray: true,
                    url: '/tatami/rest/statuses/report/reportedList',
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
