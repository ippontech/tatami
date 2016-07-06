(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('UserService', userService);

    userService.$inject = ['$resource', 'PathService'];
    function userService($resource, PathService) {
        var responseTransform = function (users) {
            users = angular.fromJson(users);

            for (var i = 0; i < users.length; i++) {
                users[i]['avatarURL'] = PathService.getAvatar(users[i]);
            }

            return users;
        };
        return $resource(PathService.buildPath('/tatami/rest/users/:username'), null,
            {
                'get': {
                    method: 'GET', params: {username: '@username'},
                    transformResponse: function (user) {
                        user = angular.fromJson(user);
                        user['avatarURL'] = PathService.getAvatar(user);
                        return user;
                    }
                },
                'query': {
                    method: 'GET',
                    isArray: true,
                    url: PathService.buildPath('/tatami/rest/users'),
                    transformResponse: responseTransform
                },
                'getFollowing': {
                    method: 'GET',
                    isArray: true,
                    params: {username: '@username'},
                    url: PathService.buildPath('/tatami/rest/users/:username/friends'),
                    transformResponse: responseTransform
                },
                'getFollowers': {
                    method: 'GET',
                    isArray: true,
                    params: {username: '@username'},
                    url: PathService.buildPath('/tatami/rest/users/:username/followers'),
                    transformResponse: responseTransform
                },
                'getSuggestions': {
                    method: 'GET',
                    isArray: true,
                    url: PathService.buildPath('/tatami/rest/users/suggestions'),
                    transformResponse: function (suggestions) {
                        suggestions = angular.fromJson(suggestions);

                        for (var i = 0; i < suggestions.length; i++) {
                            suggestions[i]['avatarURL'] = PathService.getAvatar(suggestions[i]);
                            suggestions[i]['followingUser'] = false;
                        }

                        return suggestions;
                    }
                },
                'follow': {
                    method: 'PATCH', 
                    params: {username: '@username'}
                },
                'searchUsers': {
                    method: 'GET',
                    isArray: true,
                    url: PathService.buildPath('/tatami/rest/users/:term'),
                    transformResponse: responseTransform
                },
                'deactivate': {
                    method: 'PATCH', 
                    params: {username: '@username'}
                }
            });
    }
})();
