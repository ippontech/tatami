var AccountModule = angular.module('AccountModule', ['ngResource', 'ngRoute']);

AccountModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/account/profile', {
            templateUrl: 'app/components/account/profile/AccountView.html',
            controller: 'AccountController'
        });
}]);