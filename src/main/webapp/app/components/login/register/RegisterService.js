LoginModule.factory('RegisterService', ['$resource', function($resource) {
    return $resource('/tatami/register', null, {
        'registerUser': {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}]);