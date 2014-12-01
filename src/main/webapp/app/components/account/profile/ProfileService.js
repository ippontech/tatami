ProfileModule.factory('ProfileService', function($resource) {
    return $resource(
        '/tatami/rest/account/profile', 
        { },
        { 'update': { method: 'PUT' }
    });
});