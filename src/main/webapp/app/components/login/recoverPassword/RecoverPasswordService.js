LoginModule.factory('RecoverPasswordService', ['$resource', function($resource) {
    return $resource('/tatami/lostpassword', null, {
        'resetPassword': {
            method: 'POST',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}]);