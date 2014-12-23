TatamiApp.factory('TimelineService', ['$resource', function($resource) {
    return $resource(
        null,
        null,
        {   'getTimeline': { 
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: function(statuses, headersGetter) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
                }

                return statuses;
             } },
            'getMentions': { 
            method: 'GET', isArray: true, url: '/tatami/rest/mentions',
            transformResponse: function(statuses, headersGetter) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
                }

                return statuses;
             } },
            'getFavorites': { 
            method: 'GET', isArray: true, url: '/tatami/rest/favorites',
            transformResponse: function(statuses, headersGetter) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';
                }

                return statuses;
             } }
         });
}]);