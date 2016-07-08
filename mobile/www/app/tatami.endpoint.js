(function() {
    'use strict';

    var defaultEndpoint = {url: 'http://10.1.10.13:8080'};
    //'http://app.tatamisoft.com'
    var endpoint = {url: defaultEndpoint.url};

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
