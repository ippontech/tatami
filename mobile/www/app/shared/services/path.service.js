(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('PathService', avatarService);

    avatarService.$inject = ['TatamiEndpoint'];
    function avatarService(TatamiEndpoint) {
        var service = {
            getAvatar: getAvatar
        };

        return service;

        getAvatar.$inject = ['user'];
        function getAvatar(user) {
            return TatamiEndpoint.getEndpoint().url + (user.avatar && user.avatar !== '' ? '/tatami/avatar/' + user.avatar + '/photo.jpg' : '/assets/img/default_image_profile.png');
        }

        //buildPath() removed - REST endpoints being accessed were being cached, leading to issues when swapping endpoints
        //new implementation intercepts url requests beginning with "/" and tacks on the current endpoint url as a prefix
    }
})();
