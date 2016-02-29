(function() {
    'use strict';

    angular.module('tatami')
        .factory('authInterceptor', authInterceptor);

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
})();
