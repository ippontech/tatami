(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('PathService', avatarService);

    avatarService.$inject = ['TatamiEndpoint'];
    function avatarService(TatamiEndpoint) {
        var service = {
            getAvatar: getAvatar,
            buildPath: buildPath
        };

        return service;

        getAvatar.$inject = ['user'];
        function getAvatar(user) {
            return TatamiEndpoint.getEndpoint().url + (user.avatar === '' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg');
        }

        buildPath.$inject = ['resourcePath'];
        function buildPath(resourcePath) {
            return TatamiEndpoint.getEndpoint().url + resourcePath;
        }
    }
})();
