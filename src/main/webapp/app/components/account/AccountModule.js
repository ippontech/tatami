var AccountModule = angular.module('AccountModule', ['ngResource', 'ngRoute', 'ProfileModule', 'PreferenceModule', 'PasswordModule', 'GroupsModule', 'FileModule', 'TagModule', 'UsersModule']);

AccountModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/account/:accountPage', {
            templateUrl: 'app/components/account/AccountView.html',
            controller: 'AccountController'
        });
}]);