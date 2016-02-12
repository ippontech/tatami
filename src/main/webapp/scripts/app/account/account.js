'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('account', {
                abstract: true,
                parent: 'site',
                data: {
                    authorities: [],
                    pageTitle: 'account.title'
                },
                url: '/account',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/account.html',

                    }

                },

                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }],
                    profileInfo: ['Account', function(Account) {
                        return Account.get().$promise;
                    }],

                }

            })
            .state('account.password', {
                        url: '/password',
                        templateUrl: 'scripts/app/login/password/password.html',
                        controller: 'PasswordController'
            })



    });

/*var AccountModule = angular.module('AccountModule', [
    'ProfileModule',
    'PreferencesModule',
    'PasswordModule',
    'FilesModule',
    'UsersModule',
    'GroupsModule',
    'TagsModule',
    'TopPostersModule',
    'ngToast'
]);

AccountModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
    $stateProvider
        .state('account',{
            url: '/account',
            abstract: true,
            templateUrl: 'app/components/account/AccountView.min.html',
            resolve: {
                profileInfo: ['Account', function(Account) {
                    return Account.get().$promise;
                }],
                userRoles: ['$http', function($http) {
                    return $http({ method: 'GET', url: '/tatami/rest/account/admin' }).then(function(result) {
                        return result.data;
                    });
                }]
            },
            controller: 'AccountController'
        })
        .state('account.profile', {
            url: '/profile',
            templateUrl: 'app/components/account/profile/ProfileView.min.html',
            resolve: {
                userLogin: ['UserService', 'profileInfo', function(UserService, profileInfo) {
                    return UserService.get({ username: profileInfo.username }).$promise;
                }]
            },
            controller: 'ProfileController'
        })
        .state('account.preferences', {
            url: '/preferences',
            templateUrl: 'app/components/account/preferences/PreferencesView.min.html',
            resolve: {
                prefs: ['PreferencesService', function(PreferencesService) {
                    return PreferencesService.get().$promise;
                }]
            },
            controller: 'PreferencesController'
        })
        .state('account.password', {
            url: '/password',
            templateUrl: 'app/components/account/password/PasswordView.min.html',
            controller: 'PasswordController'
        })
        .state('account.files', {
            url: '/files',
            templateUrl: 'app/components/account/files/FilesView.min.html',
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
            templateUrl: 'app/components/account/FormView.min.html',
            controller: 'FormController'
        })
        .state('account.users.following', {
            url: '/following',
            templateUrl: 'app/components/account/users/UsersView.html',
            resolve: {
                usersList: ['profileInfo', 'UserService', function(profileInfo, UserService) {
                    return UserService.getFollowing({ username: profileInfo.username }).$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('account.users.recommended', {
            url: '/recommended',
            templateUrl: 'app/components/account/users/UsersView.min.html',
            resolve: {
                usersList: ['UserService', function(UserService) {
                    UserService.getSuggestions().$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('account.users.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/users/UsersView.min.html',
            resolve: {
                usersList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'users', q: $stateParams.q }).$promise;
                }]
            },
            controller: 'UsersController'
        })
        .state('account.groups', {
            url: '/groups',
            templateUrl: 'app/components/account/FormView.min.html',
            controller: 'FormController'
        })
        .state('account.groups.main', {
            url: '',
            templateUrl: 'app/components/account/groups/GroupsView.min.html',
            controller: 'GroupController'
        })
        .state('account.groups.main.top', {
            url: '',
            views: {
                'create@account.groups.main': {
                    templateUrl: 'app/components/account/groups/creation/GroupsCreateView.min.html',
                    controller: 'GroupsCreateController'
                }
            }
        })
        .state('account.groups.main.top.list', {
            url: '',
            views: {
                'list@account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.min.html',
                    resolve: {
                        userGroups: ['GroupService', function(GroupService) {
                            return GroupService.query().$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('account.groups.main.top.recommended', {
            url: '/recommended',
            views: {
                'list@account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.min.html',
                    resolve: {
                        userGroups: ['GroupService', function(GroupService) {
                            return GroupService.getRecommendations().$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('account.groups.main.top.search', {
            url: '/search/:q',
            views: {
                'list@account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.min.html',
                    resolve: {
                        userGroups: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                            return SearchService.query({ term: 'groups', q: $stateParams.q }).$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('account.groups.manage', {
            url:'/:groupId',
            templateUrl: 'app/components/account/groups/manage/GroupsManageView.min.html',
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
        .state('account.tags', {
            url:'/tags',
            templateUrl: 'app/components/account/FormView.min.html',
            controller: 'FormController'
        })
        .state('account.tags.following', {
            url: '/following',
            templateUrl: 'app/components/account/tags/TagsView.min.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.query().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('account.tags.trends', {
            url: '/trends',
            templateUrl: 'app/components/account/tags/TagsView.min.html',
            resolve: {
                tagList: ['TagService', function(TagService) {
                    return TagService.getPopular().$promise;
                }]
            },
            controller: 'TagsController'
        })
        .state('account.tags.search', {
            url: '/search/:q',
            templateUrl: 'app/components/account/tags/TagsView.min.html',
            resolve: {
                tagList: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    if($stateParams.q.length === 0) {
                        return {};
                    }
                    else {
                        return SearchService.query({ term: 'tags', q: $stateParams.q }).$promise;
                    }
                }]
            },
            controller: 'TagsController'
        })
        .state('account.topPosters', {
            url: '/top',
            templateUrl: 'app/components/account/topPosters/TopPostersView.min.html',
            resolve: {
                topPosters: ['TopPostersService', function(TopPostersService) {
                    // Get the {username, count} pairs for all the top posters
                    return TopPostersService.query().$promise;
                }],

                users: ['topPosters', 'UserService', '$q', function(topPosters, UserService, $q) {
                    // For all the {user, count} pairs, find the user data
                    var temp = [];
                    for(var i = 0; i < topPosters.length; ++i) {
                        // Store the result as a promise
                        temp.push(UserService.get({ username: topPosters[i].username }).$promise);
                        temp[i].statusCount = topPosters[i].statusCount;
                    }
                    // return all promises
                    return $q.all(temp);
                }],

                userData: ['topPosters', 'users', function(topPosters, users) {
                    var statusCounts = [];
                    // We want to associate the {username, count} pairs from the original to the user data, index based
                    // on username.
                    for(var i = 0; i < topPosters.length; ++i) {
                        statusCounts[topPosters[i].username] = topPosters[i].statusCount;
                    }

                    var temp = [];
                    for(var x = 0; x < users.length; ++x) {
                        // Create the current user to contain the user data, and how many posts they've made today
                        var curUser = {};
                        curUser.info = users[x];
                        curUser.statusCount = statusCounts[users[x].username];
                        temp.push(curUser);
                    }
                    return temp;
                }]
            },
            controller: 'TopPostersController'
        });
}]);*/
