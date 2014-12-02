var AccountModule = angular.module('AccountModule', [
    'ProfileModule', 
    'PreferencesModule', 
    'PasswordModule', 
    'FilesModule', 
    'UsersModule', 
    'GroupsModule', 
    'TagsModule', 
    'ngResource'
]);

AccountModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('account',{
            url: '/account',
            templateUrl: 'app/components/account/AccountView.html',
            controller: 'AccountController'
        })
        .state('account.profile', {
            url: '/profile',
            templateUrl: 'app/components/account/profile/ProfileView.html',
            controller: 'AccountProfileController'
        })
        .state('account.preferences', {
            url: '/preferences',
            templateUrl: 'app/components/account/preferences/PreferencesView.html',
            controller: 'PreferencesController'
        })
        .state('account.password', {
            url: '/password',
            templateUrl: 'app/components/account/password/PasswordView.html',
            controller: 'PasswordController'
        })
        .state('account.files', {
            url: '/files',
            templateUrl: 'app/components/account/files/FilesView.html',
            controller: 'FilesController'
        })
        .state('account.users', {
            url: '/users',
            templateUrl: 'app/components/account/users/UsersView.html',
            controller: 'UsersController'
        })
        .state('account.users.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/users/UsersView.html',
            controller: 'UsersController'
        })
        .state('account.users.search', {
            url: '/search',
            templateUrl: 'app/components/account/users/UsersView.html',
            controller: 'UsersCoontroller'
        })
        .state('account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            controller: 'GroupsController'
        })
        .state('account.groups.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            controller: 'GroupsController'
        })
        .state('account.groups.search', {
            url: '/search',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            controller: 'GroupsController'
        })
        .state('account.tags', {
            url: '/tags',
            templateUrl: 'app/components/account/tags/TagsView.html',
            controller: 'TagsController'
        })
        .state('account.tags.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/tags/TagsView.html',
            controller: 'TagsController'
        })
        .state('account.tags.search', {
            url: '/search',
            templateUrl: 'app/components/account/tags/TagsView.html',
            controller: 'TagsController'
        })
        .state('account.sotd', {
            url: '/sotd',
            templateUrl: 'app/components/account/sotd/DailyStatusView.html'
        });
}]);