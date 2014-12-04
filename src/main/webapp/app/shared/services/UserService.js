TatamiApp.factory('UserService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/users/:username',
        { },
        { 
            'get': { 
                method: 'GET', params: { username: '@username' },
                transformResponse: function(user, headersGetter) {
                        user = angular.fromJson(user);
                        user['avatarURL'] = user.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                        return user;
                } },
            'query': { 
                method: 'GET', isArray: true, url: '/tatami/rest/users',
                transformResponse: function(users, headersGetter) {
                    users = angular.fromJson(users);

                    for(var i = 0; i < users.length; i++) {
                        users[i]['avatarURL'] = users[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
                    }

                    return users;
                } },
            'follow': { method: 'PATCH', params: { username: '@username' } },
            'getFriends': { 
                method: 'GET', isArray: true, url: '/tatami/rest/users/:userId/friends', params: { userId: '@userId' },
                transformResponse: function(friends, headersGetter) {
                        friends = angular.fromJson(friends);

                        for(var i = 0; i < friends.length; i++) {
                            friends[i]['avatarURL'] = friends[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + friends[i].avatar + '/photo.jpg';
                        }

                        return friends;
                } },
            'getSuggestions': { 
                method: 'GET', isArray: true, url: '/tatami/rest/users/suggestions', 
                transformResponse: function(suggestions, headersGetter) {
                    suggestions = angular.fromJson(suggestions);

                    for(var i = 0; i < suggestions.length; i++) {
                        suggestions[i]['followingUser'] = false;
                    }

                    return suggestions;
                }
            }
    });
}]);