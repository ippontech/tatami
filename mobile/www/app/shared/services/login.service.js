(function() {
    'use strict';

    angular.module('tatami')
        .factory('LoginService', loginService);

    loginService.$inject = ['$resource', 'TatamiEndpoint'];
    function loginService($resource, TatamiEndpoint) {
        var loginRequestTransform = loginRequestTransform;

        loginRequestTransform.$inject = ['obj'];
        function loginRequestTransform(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }

        return $resource(TatamiEndpoint.url  + '/tatami/authentication', null,
            {
                'login': {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: loginRequestTransform
                }
            });
    }
})();
