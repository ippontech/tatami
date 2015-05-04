TatamiApp.factory('SearchService', ['$resource', function($resource) {
    var responseTransform = function(users) {
        users = angular.fromJson(users);

        for(var i = 0; i < users.length; i++) {
            users[i]['avatarURL'] = users[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
        }

        return users;
    };

    return $resource('/tatami/rest/search/:term', { term: '@term' },
    {
        'query': { 
            method: 'GET', isArray: true, transformResponse: responseTransform
        },
        'get': {
            method: 'GET', transformResponse: responseTransform
        }
    });
}]);