var AccountModule = angular.module('AccountModule', [
    'ngResource',
    'ProfileModule', 
    'PreferencesModule', 
    'PasswordModule', 
    'FilesModule', 
    'UsersModule', 
    'GroupsModule', 
    'TagsModule'
]);

AccountModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/groups', '/groups/');
    $stateProvider
        .state('account',{
            url: '/account',
            abstract: true,
            templateUrl: 'app/components/account/AccountView.html',
            resolve: {
                ProfileService: 'ProfileService',
                profileInfo: function(ProfileService) {
                    return ProfileService.get().$promise;
                }
            },
            controller: 'AccountController'
        })
        .state('account.profile', {
            url: '/profile',
            templateUrl: 'app/components/account/profile/ProfileView.html',
            controller: 'ProfileController'
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
            resolve: {
                FilesService: 'FilesService',
                attachmentQuota: function(FilesService) {
                    return FilesService.getQuota().$promise;
                },

                fileList: function(FilesService) {
                    return FilesService.query().$promise;
                }
            },
            controller: 'FilesController'
        })
        .state('account.users', {
            url: '/users',
            templateUrl: 'app/components/account/users/UsersView.html',
            data: {
                dataUrl: ''
            },
            controller: 'UsersController'
        })
        .state('account.users.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/users/UsersView.html',
            data: {
                dataUrl: '/tatami/rest/users/suggestions'
            },
            controller: 'UsersController'
        })
        .state('account.users.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/users/UsersView.html',
            data: {
                dataUrl: 'search'
            },
            controller: 'UsersController'
        })
        /*
        .state('account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        */
        .state('account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            data: {
                dataUrl: '/tatami/rest/groups/'
            },
            controller: 'GroupsController'
        })
        .state('account.groups.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            data: {
                dataUrl: '/tatami/rest/groupmemberships/suggestions'
            },
            controller: 'GroupsController'
        })
        .state('account.groups.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            data: {
                dataUrl: ''
            },
            controller: 'GroupsController'
        })
        .state('account.groups.manage', {
            url:'/:groupId',
            templateUrl: 'app/components/account/groups/GroupsManageView.html',
            controller:'GroupsManageController',
            parent: 'account'
        })
        .state('account.tags', {
            url: '/tags',
            templateUrl: 'app/components/account/tags/TagsView.html',
            data: {
                dataUrl: '/tatami/rest/tags'
            },
            controller: 'TagsController'
        })
        .state('account.tags.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/tags/TagsView.html',
            data: {
                dataUrl: '/tatami/rest/tags/popular'
            },
            controller: 'TagsController'
        })
        .state('account.tags.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/tags/TagsView.html',
            data: {
                dataUrl: ''
            },
            controller: 'TagsController'
        })
        .state('account.sotd', {
            url: '/sotd',
            templateUrl: 'app/components/account/sotd/DailyStatusView.html'
        });
}]);