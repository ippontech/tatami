tatamiJHipsterApp
    .factory('StatsService', ['$resource', function($resource){
        var responseTransform = function(stats) {
            stats = angular.fromJson(stats);

            return stats;
        }

        return $resource('/tatami/rest/stats',null,{
            'get': {
                method: 'GET', isArray: true, url: '/tatami/rest/stats/day',
                transformResponse: responseTransform
            }
        });
    }]);
