 'use strict';

tatamiJHipsterApp
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-tatamiJHipsterApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-tatamiJHipsterApp-params')});
                }
                return response;
            }
        };
    });
