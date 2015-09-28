LoginModule.factory('RegistrationService', ['$resource', function($resource) {
    return $resource('/tatami/:register', null, {
        'resetPassword': {
            method: 'POST',
            url: '/tatami/lostpassword',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        'getUpdate': {
            method: 'GET'
        },
        'registerUser': {
            method: 'POST',
            url: '/tatami/register',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}]);