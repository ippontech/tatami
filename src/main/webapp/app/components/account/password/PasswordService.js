PasswordModule.factory('PasswordService', function($resource){
    return $resource('/tatami/rest/account/password/');
})