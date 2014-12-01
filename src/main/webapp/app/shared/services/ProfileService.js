TatamiApp.factory('ProfileService', ['$resource', function($resource) {
    return $resource('/tatami/rest/account/profile', null, {
        'update' : {method: 'PUT'}
    });
}]);