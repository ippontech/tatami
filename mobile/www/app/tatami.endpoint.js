(function() {
    'use strict';
    var defaultEndpoint = {url: 'http://app.tatamisoft.com'};
    var endpoint = {url: defaultEndpoint.url};

    angular.module('tatami')
        .factory('TatamiEndpoint', tatamiEndpoint);

    tatamiEndpoint.$inject = ['$localStorage'];
    function tatamiEndpoint($localStorage) {
        var service = {
            getEndpoint: getEndpoint,
            setEndpoint: setEndpoint,
            getDefault: getDefaultEndpoint,
            reset: reset,
            prepare: prepare
        };

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

        function prepare() {
            endpoint = $localStorage.get('endpoint');
            if (endpoint == undefined || endpoint == {}) {
                $localStorage.signOut();
                endpoint = defaultEndpoint;
                $localStorage.set('endpoint', defaultEndpoint);
            }
        }
    }
})();
