(function() {
    'use strict';

    var endpoint = { url: 'http://app.tatamisoft.com' };

    angular.module('tatami')
        .factory('TatamiEndpoint', tatamiEndpoint);

    function tatamiEndpoint() {
        var service = {
            getEndpoint: getEndpoint,
            setEndpoint: setEndpoint
        };

        return service;

        function getEndpoint() {
            return endpoint;
        }

        setEndpoint.$inject = ['updated'];
        function setEndpoint(updated) {
            endpoint.url = updated;
        }
    }
})();
