(function() {
    'use strict';

    angular.module('tatami')
        .factory('authInterceptor', authInterceptor)
        .factory('authExpiredInterceptor', authExpiredInterceptor);

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
})();
