TatamiApp.factory('UsersService', ['$resource', function($resource) {
    return $resource(
        '/tatami/rest/users/:username',
        { },
        { 'get': { method:'GET', params: { username: '@username' } }
    });
}]);