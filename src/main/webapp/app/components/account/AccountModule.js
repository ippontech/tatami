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
        .when('/recommended', {
            templateUrl: 'app/components/account/AccountView.html',
            controller: 'AccountController',
            resolve: {
                tabs: function() { return {groupTab: true, trendGroup: false, searchTab: true}; }
            }
        }).
        when('/account/:accountPage', {
            templateUrl: 'app/components/account/AccountView.html',
            controller: 'AccountController'
        });
}]);