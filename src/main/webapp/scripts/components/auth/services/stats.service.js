(function() {
    'use strict';

    angular.module('tatamiJHipsterApp')
        .factory('StatsService', statsService);

    statsService.$inject = ['$resource'];

    function statsService($resource) {
        var responseTransform = function(stats) {
            stats = angular.fromJson(stats);
            return stats;
        };

        return $resource('/tatami/rest/stats',null,{
            'get': {
                method: 'GET',
                isArray: true,
                url: '/tatami/rest/stats/day',
                transformResponse: responseTransform
            }
        });
    }
})();
