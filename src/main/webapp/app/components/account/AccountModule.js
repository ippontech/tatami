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
                profileInfo: ['ProfileService', function(ProfileService) {
                    return ProfileService.get().$promise;
                }]
            },
            controller: 'AccountController'
        })
        .state('account.profile', {
            url: '/profile',
            templateUrl: 'app/components/account/profile/ProfileView.html',
            resolve: {
                userLogin: ['UserService', 'profileInfo', function(UserService, profileInfo) {
                    return UserService.get({ username: profileInfo.username }).$promise;
                }]
            },
            controller: 'ProfileController'
        })
        .state('account.preferences', {
            url: '/preferences',
            templateUrl: 'app/components/account/preferences/PreferencesView.html',
            resolve: {
                prefs: ['PreferencesService', function(PreferencesService) {
                    return PreferencesService.get().$promise;
                }]
            },
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
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('account.users.list', {
            url: '',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['ProfileService', 'UserService', function(ProfileService, UserService) {
                    ProfileService.get().$promise.then(function(result) {
                        return UserService.getFollowing({ username: result.username }).$promise;
                    })
                }]
            },
            controller: 'UsersController'
        })
        .state('account.users.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['UserService', function(UserService) {
                    UserService.getSuggestions().$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('account.users.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'users', q: $stateParams.q }).$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('account.groups.list', {
            url: '',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('account.groups.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['GroupService', function(GroupService) {
                    return GroupService.getRecommendations().$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('account.groups.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'groups', q: $stateParams.q }).$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('account.groups.manage', {
            url:'/:groupId',
            templateUrl: 'app/components/account/groups/GroupsManageView.html',
            controller:'GroupsManageController'
        })
        .state('account.tags', {
            url:'/tags',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('account.tags.list', {
            url: '/tags',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.query().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('account.tags.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.getPopular().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('account.tags.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    if($stateParams.q.length == 0) {
                        return {};
                    }
                    else{
                        return SearchService.query({ term: 'tags', q: $stateParams.q }).$promise;
                    }
                }]
            },
            controller: 'TagsController'
        })
        .state('account.sotd', {
            url: '/sotd',
            templateUrl: 'app/components/account/sotd/DailyStatusView.html'
        });
}]);