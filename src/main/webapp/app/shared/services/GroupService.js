TatamiApp.factory('GroupService', ['$resource', function($resource) {
    return $resource('/tatami/rest/groups/:groupId', null,
    {
        'getStatuses': { 
            method: 'GET',
            isArray: true,
            params: { groupId: '@groupId' },
            url: '/tatami/rest/groups/:groupId/timeline',
            transformResponse: function(statuses) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

                    if(statuses[i].geoLocalization) {
                        var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                        statuses[i]['locationURL'] = 
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                return statuses;
            }
        },
        'getMembers': { 
            method: 'GET',
            isArray: true,
            params: { groupId: '@groupId' },
            url: '/tatami/rest/groups/:groupId/members/',
            transformResponse: function(users) {
                users = angular.fromJson(users);

                for(var i = 0; i < users.length; i++) {
                    users[i]['avatarURL'] = users[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
                }

                return users;
            }
        },
        'getRecommendations': { method: 'GET', isArray: true, url: '/tatami/rest/groupmemberships/suggestions' },
        'join': { method: 'PUT', params: { groupId: '@groupId', username: '@username' }, url: '/tatami/rest/groups/:groupId/members/:username' },
        'leave': { method: 'DELETE', params: { groupId: '@groupId', username: '@username' }, url: '/tatami/rest/groups/:groupId/members/:username' },
        'update': { method: 'PUT', params: { groupId: '@groupId' }, url: '/tatami/rest/groups/:groupId' }
    });
}]);