TatamiApp.factory('UserService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/users/:username',
        { },
        { 'get': { method: 'GET', params: { username: '@username' } },
          'query': { method: 'GET', isArray: true, url: '/tatami/rest/users' },
          'follow': { method: 'PATCH', params: { username: '@username' } },
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