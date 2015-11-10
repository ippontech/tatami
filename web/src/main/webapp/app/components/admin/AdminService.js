AdminModule.factory('AdminService', ['$resource', function($resource) {
    return $resource('/tatami/admin/:options', { options: '@options' }, {
        'toggleAdmin': {
            url: '/tatami/rest/account/admin', method: 'POST'
        }
    });
}]);