'use strict';

tatamiJHipsterApp
    .factory('AccountService', function AccountService($resource) {
        return $resource('/tatami/rest/account/profile', {}, {
            'get': {
                method: 'GET',
                params: {},
                isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });
