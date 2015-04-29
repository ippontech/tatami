TatamiApp.factory('UserService', ['$resource', function($resource) {
    var responseTransform = function(users) {
        users = angular.fromJson(users);

        for(var i = 0; i < users.length; i++) {
            users[i]['avatarURL'] = users[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
        }

        return users;
    };

    return $resource('/tatami/rest/users/:username', null,
    { 
        'get': { 
            method: 'GET', params: { username: '@username' },
            transformResponse: function(user) {
                user = angular.fromJson(user);
                user['avatarURL'] = user.avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            }
        },
        'query': { 
            method: 'GET', isArray: true, url: '/tatami/rest/users',
            transformResponse: responseTransform
        },
        'getFollowing': { 
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/users/:username/friends',
            transformResponse: responseTransform
        },
        'getFollowers': { 
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/users/:username/followers',
            transformResponse: responseTransform
        },
        'getSuggestions': { 
            method: 'GET', isArray: true, url: '/tatami/rest/users/suggestions', 
            transformResponse: function(suggestions) {
                suggestions = angular.fromJson(suggestions);

                for(var i = 0; i < suggestions.length; i++) {
                    suggestions[i]['avatarURL'] = suggestions[i].avatar==='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + suggestions[i].avatar + '/photo.jpg';
                    suggestions[i]['followingUser'] = false;
                }

                return suggestions;
            }
        },
        'follow': { method: 'PATCH', params: { username: '@username' } },
        'searchUsers': { method: 'GET', isArray: true, url: '/tatami/rest/users/:term', transformResponse: responseTransform },
        'deactivate': { method: 'PATCH', params: { username: '@username' } }
    });
}]);