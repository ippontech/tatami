(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('BlockService', blockService);

    blockService.$inject = ['$resource', 'PathService'];
    function blockService($resource, PathService) {

        var responseTransform = function (users) {
            users = angular.fromJson(users);

            for (var i = 0; i < users.length; i++) {
                users[i]['avatarURL'] = PathService.getAvatar(users[i]);
            }
            return users;
        };

        return $resource(null, null,
            {
                'getBlockedUsersForUser': {
                    method: 'GET',
                    isArray: true,
                    params: {username: '@username'},
                    url: '/tatami/rest/block/blockedusers/:username',
                    transformResponse: responseTransform
                },
                'updateBlockedUser': {
                    method: 'PATCH',
                    params: { username: '@username'},
                    url: '/tatami/rest/block/update/:username',
                    transformResponse: function (blockedUser) {
                        blockedUser = angular.fromJson(blockedUser);
                        return blockedUser;
                    }
                }
            });

    }

})();
