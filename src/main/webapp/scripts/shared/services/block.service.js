(function() {
    'use strict';

    angular.module('tatamiJHipsterApp')
        .factory('BlockService', blockService);

    blockService.$inject = ['$resource'];
    function blockService($resource) {

        var responseTransform = function(users) {
            users = angular.fromJson(users);

            for(var i = 0; i < users.length; i++) {
                users[i]['avatarURL'] = !users[i].avatar ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
            }

            return users;
        };

        return $resource(null, null,
            {
                'getBlockedUsersForUser': {
                    method: 'GET',
                    isArray: true,
                    params: {email: '@username'},
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
