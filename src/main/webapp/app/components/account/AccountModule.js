var AccountModule = angular.module('AccountModule', [
    'ngResource',
    'ProfileModule', 
    'PreferencesModule', 
    'PasswordModule', 
    'FilesModule', 
    'UsersModule', 
    'GroupsModule', 
    'TagsModule',
    'DailyStatusModule',
]);

AccountModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tatami.account',{
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
        .state('tatami.account.profile', {
            url: '/profile',
            templateUrl: 'app/components/account/profile/ProfileView.html',
            resolve: {
                userLogin: ['UserService', 'profileInfo', function(UserService, profileInfo) {
                    return UserService.get({ username: profileInfo.username }).$promise;
                }]
            },
            controller: 'ProfileController'
        })
        .state('tatami.account.preferences', {
            url: '/preferences',
            templateUrl: 'app/components/account/preferences/PreferencesView.html',
            resolve: {
                prefs: ['PreferencesService', function(PreferencesService) {
                    return PreferencesService.get().$promise;
                }]
            },
            controller: 'PreferencesController'
        })
        .state('tatami.account.password', {
            url: '/password',
            templateUrl: 'app/components/account/password/PasswordView.html',
            controller: 'PasswordController'
        })
        .state('tatami.account.files', {
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
        .state('tatami.account.users', {
            url: '/users',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('tatami.account.users.following', {
            url: '/following',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['profileInfo', 'UserService', function(profileInfo, UserService) {
                    return UserService.getFollowing({ username: profileInfo.username }).$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('tatami.account.users.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['UserService', function(UserService) {
                    UserService.getSuggestions().$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('tatami.account.users.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'users', q: $stateParams.q }).$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('tatami.account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('tatami.account.groups.list', {
            url: '',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('tatami.account.groups.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['GroupService', function(GroupService) {
                    return GroupService.getRecommendations().$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('tatami.account.groups.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            resolve: {
                userGroups: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'groups', q: $stateParams.q }).$promise;
                }]
            },
            controller: 'GroupsController'
        })
        .state('tatami.account.groups.manage', {
            url:'/:groupId',
            templateUrl: 'app/components/account/groups/GroupsManageView.html',
            resolve: {
                group: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.get({ groupId: $stateParams.groupId }).$promise;
                }],

                members: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.getMembers({ groupId: $stateParams.groupId }).$promise;
                }]
            },
            controller:'GroupsManageController'
        })
        .state('tatami.account.tags', {
            url:'/tags',
            templateUrl: 'app/components/account/FormView.html',
            controller: 'FormController'
        })
        .state('tatami.account.tags.following', {
            url: '/following',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.query().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('tatami.account.tags.trends', {
            url: '/trends',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.getPopular().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('tatami.account.tags.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/tags/TagsView.html',
            resolve: {
                tagList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    if($stateParams.q.length == 0) {
                        return {};
                    }
                    else {
                        return SearchService.query({ term: 'tags', q: $stateParams.q }).$promise;
                    }
                }]
            },
            controller: 'TagsController'
        })
        .state('tatami.account.sotd', {
            url: '/sotd',
            templateUrl: 'app/components/account/sotd/DailyStatusView.html',
            resolve: {
                dailyStats: ['DailyStatusData', 'DailyStatusService', function(DailyStatusData, DailyStatusService) {
                    return DailyStatusService.query().$promise;
                }]
            },
            controller: 'DailyStatusController'
        });
}]);