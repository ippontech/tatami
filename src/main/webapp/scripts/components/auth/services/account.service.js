'use strict';

tatamiJHipsterApp
    .factory('Account', function Account($resource) {
        return $resource('/tatami/rest/account/profile', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });
