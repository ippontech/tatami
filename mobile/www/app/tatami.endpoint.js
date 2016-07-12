(function() {
    'use strict';
    var defaultEndpoint = {url: 'http://app.tatamisoft.com'};
    var endpoint = {url: defaultEndpoint.url}; // Should set to the localStorage endpoint URL (default to defaultEndpoint if unset)

    angular.module('tatami')
        .factory('TatamiEndpoint', tatamiEndpoint);

    function tatamiEndpoint() {
        var service = {
            getEndpoint: getEndpoint,
            setEndpoint: setEndpoint,
            getDefault: getDefaultEndpoint,
            reset: reset
        };

        return service;

        function getEndpoint() {
            return endpoint;
        }

        setEndpoint.$inject = ['updated'];
        function setEndpoint(updated) {
            endpoint.url = updated;
        }

        function getDefaultEndpoint() {
            return defaultEndpoint;
        }

        function reset() {
            endpoint = defaultEndpoint;
        }
    }
})();
