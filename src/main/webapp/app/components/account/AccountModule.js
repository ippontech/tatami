var AccountModule = angular.module('AccountModule', [
    'ProfileModule', 
    'PreferencesModule', 
    'PasswordModule', 
    'FilesModule', 
    'UsersModule', 
    'GroupsModule', 
    'TagsModule', 
    'ngResource', 
    'ngRoute'
]);

AccountModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/account/:accountPage', {
            templateUrl: 'app/components/account/AccountView.html',
            controller: 'AccountController'
        });
}]);