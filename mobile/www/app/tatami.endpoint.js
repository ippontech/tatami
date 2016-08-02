(function() {
    'use strict';
    var defaultEndpoint = {url: 'http://app.tatamisoft.com'};
    var endpoint;

    angular.module('tatami')
        .factory('TatamiEndpoint', tatamiEndpoint);

    tatamiEndpoint.$inject = ['$localStorage'];
    function tatamiEndpoint($localStorage) {
        var service = {
            getEndpoint: getEndpoint,
            setEndpoint: setEndpoint,
            getDefault: getDefaultEndpoint,
            reset: reset
        };

        endpoint = $localStorage.get('endpoint');
        if(!endpoint || !endpoint.url) {
            $localStorage.signOut();
            endpoint = {url: defaultEndpoint.url};
            $localStorage.set('endpoint', endpoint);
        }

        return service;

        function getEndpoint() {
            return endpoint;
        }

        setEndpoint.$inject = ['updated'];
        function setEndpoint(updated) {
            endpoint.url = updated;
            $localStorage.set('endpoint', endpoint);
        }

        function getDefaultEndpoint() {
            return defaultEndpoint;
        }

        function reset() {
            setEndpoint(defaultEndpoint.url);
        }
    }
})();
