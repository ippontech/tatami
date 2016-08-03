(function() {
    'use strict';

    angular.module('tatami')
        .factory('authInterceptor', authInterceptor)
        .factory('authExpiredInterceptor', authExpiredInterceptor)
        .factory('endpointInterceptor', endpointInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', '$location', '$localStorage'];
    function authInterceptor($rootScope, $q, $location, $localStorage) {
        var interceptor = {
            request: request
        };

        return interceptor;

        request.$inject = ['config'];
        function request(config) {
            config.headers = config.headers || {};
            var token = $localStorage.get('token');

            if (token && token.expires && token.expires > new Date().getTime()) {
                config.headers['x-auth-token'] = token.token;
            }

            return config;
        }
    }

    authExpiredInterceptor.$inject = ['$q', '$localStorage', '$injector'];
    function authExpiredInterceptor($q, $localStorage, $injector) {
        var interceptor = {
            responseError: responseError
        };

        return interceptor;

        responseError.$inject = ['response'];
        function responseError(response) {
            if(response.status === 401 && (response.data.error == 'invalid_token' || response.data.error == 'Unauthorized')) {
                $localStorage.signOut();
                var $state = $injector.get('$state');
                $state.go('login');
            }

            return $q.reject(response);
        }
    }

    /* endpointInterceptor built to replace PathService.buildPath(resource)
     *
     * Old implementation was causing issues - for some reason, REST path requests randomly started getting cached
     * so an attempt to access /rest/authentication wouldn't reach buildPath but would return the endpoint used initially
     * This interceptor never caches, so it's a better implementation.
     * 
     * NOTE: Only make requests to server beginning with "/"; only access documents locally using the first folder and
     * NOT "/"; static url requests (i.e. to google.com) should begin with http://, NEVER "/".
     *
     * ONLY USE "/" AS FIRST CHARACTER OF REQUESTS IF YOU NEED THE ENDPOINT URL TO BE A PREFIX
     */
    endpointInterceptor.$inject = ['$localStorage'];
    function endpointInterceptor($localStorage) {
        var interceptor = {
            request: request
        };

        return interceptor;

        request.$inject = ['config'];
        function request(config) {
            if(config.url.indexOf("/") == 0) {
                config.url = $localStorage.get('endpoint').url + config.url;
            }

            return config;
        }
    }
})();
