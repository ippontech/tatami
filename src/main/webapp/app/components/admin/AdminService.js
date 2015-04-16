AdminModule.factory('AdminService', ['$resource', function($resource) {
    return $resource('/tatami/admin/:options', { options: '@options' });
}]);