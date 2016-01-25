(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('LoginService', loginService);

    loginService.$inject = ['$resource', 'PathService'];
    function loginService($resource, PathService) {
        var loginRequestTransform = loginRequestTransform;

        loginRequestTransform.$inject = ['obj'];
        function loginRequestTransform(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }

        return $resource(PathService.buildPath('/tatami/authentication'), null,
            {
                'login': {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: loginRequestTransform
                }
            });
    }
})();
