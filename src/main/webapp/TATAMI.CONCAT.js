var TatamiApp = angular.module('TatamiApp', [
    'TopMenuModule',
    'LoginModule',
    'HomeModule',
    'AccountModule',
    'AboutModule',
    'AdminModule',
    'ngResource',
    'ngTouch',
    'ngCookies',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    'mentio',
    'LocalStorageModule',
    'bm.bsTour'
]);

TatamiApp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        if($state.includes('tatami.home') && toState !== fromState) {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    });
}]);

TatamiApp.run(['$rootScope', '$state', '$stateParams', 'AuthenticationService', 'UserSession', function($rootScope, $state, $stateParams, AuthenticationService, UserSession) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    UserSession.authenticate().then(function(result) {
        if(result !== null) {
            if(result.action === null) {
                if(angular.isDefined($state.current.data) && !$state.current.data.public) {
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }
                if(angular.isDefined($rootScope.destinationState)) {
                    $state.go($rootScope.destinationState, $rootScope.destinationParams);
                }
                else {
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }
            }
            if(angular.isDefined(result.username)) {
                if(!UserSession.isAuthenticated()) {
                    UserSession.setLoginState(true);
                }
                if(!angular.isDefined($rootScope.destinationState)) {
                    $state.go('tatami.home.home.timeline');
                }
            }
        }
        else {
            $state.go('tatami.login.main');
        }
    });

    $rootScope.$on('$stateChangeError', function(event) {
        event.preventDefault();
        $state.transitionTo('tatami.pageNotFound', null, { location: false });
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        $rootScope.destinationState = toState;
        $rootScope.destinationParams = toStateParams;
        if(UserSession.isAuthenticated()) {
            return;
        }

        if(toState.data && toState.data.public) {
            return;
        }
        $rootScope.returnToState = toState;
        $rootScope.returnToParams = toStateParams;
        event.preventDefault();
        $state.go('tatami.login.main');
    });
}]);

TatamiApp.config(['$resourceProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function($resourceProvider, $locationProvider, $urlRouterProvider, $stateProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            .state('tatami', {
                url: '',
                abstract: true,
                views: {
                    'topMenu@': {
                        templateUrl: 'app/shared/topMenu/TopMenuView.html',
                        controller: 'TopMenuController'
                    },
                    '': {
                        templateUrl: 'index.html'
                    }
                },
                resolve: {
                    authorize: ['AuthenticationService', function(AuthenticationService) {
                        return AuthenticationService.authenticate();
                    }]
                },
                data: {
                    public: false,
                    roles: ["ROLE_USER"]
                }
            })
            .state('tatami.pageNotFound', {
                templateUrl: 'app/shared/error/404View.html',
                data: {
                    public: true
                }
            })
            .state('tatami.accessdenied', {
                templateUrl: 'app/shared/error/500View.html',
                data: {
                    public: true
                }
            });
}]);;var TopMenuModule = angular.module('TopMenuModule', ['PostModule']);;var LoginModule = angular.module('LoginModule', []);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.login', {
            url: '',
            abstract: true,
            templateUrl: 'app/components/login/LoginView.html'
        })
        .state('tatami.login.main', {
            url: '/login?action',
            views: {
                'manualLogin': {
                    templateUrl: '/app/components/login/manual/ManualLoginView.html',
                    controller: 'ManualLoginController'
                },
                'recoverPassword': {
                    templateUrl: '/app/components/login/recoverPassword/RecoverPasswordView.html',
                    controller: 'RecoverPasswordController'
                },
                'googleLogin': {
                    templateUrl: '/app/components/login/google/GoogleLoginView.html',
                    controller: 'GoogleLoginController'
                },
                'register': {
                    templateUrl: '/app/components/login/register/RegisterView.html',
                    controller: 'RegisterController'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.registration', {
            url: '/register?key',
            templateUrl: '/app/components/login/email/EmailRegistration.html',
            controller: 'EmailRegistrationController',
            resolve: {
                update: ['RegistrationService', '$stateParams', function(RegistrationService, $stateParams) {
                    return RegistrationService.getUpdate({ register: 'register', key: $stateParams.key }).$promise;
                }]
            },
            data: {
                public: true
            }
        });
}]);;var AboutModule = angular.module('AboutModule', []);

AboutModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.about',{
            url: '/about',
            abstract: true,
            templateUrl: 'app/components/about/AboutView.html'
        })
        .state('tatami.about.presentation', {
            url: '/presentation',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/presentation/PresentationView.html'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.about.tos', {
            url: '/tos',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/tos/ToSView.html'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.about.license', {
            url: '/license',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/license/LicenseView.html',
                    controller: 'LicenseController'
                }
            },
            data: {
                public: true
            }
        });
}]);;var HomeModule = angular.module('HomeModule', [
    'HomeSidebarModule',
    'ProfileSidebarModule',
    'ngSanitize',
    'angularMoment',
    'infinite-scroll',
    'emguo.poller'
]);

HomeModule.config(['pollerConfig', function(pollerConfig) {
    pollerConfig.resetOnStateChange = true;
}]);

HomeModule.config(['$stateProvider', function($stateProvider) {
    /*
    var getContext = ['statuses', 'StatusService', '$q', function(statuses, StatusService, $q) {
        var temp = new Set();
        var context = [];

        for(var i = 0; i < statuses.length; ++i) {
            if(statuses[i].replyTo && !temp.has(statuses[i].replyTo)) {
                temp.add(statuses[i].replyTo);
                context.push(StatusService.get({ statusId: statuses[i].replyTo })
                    .$promise.then(
                        function(response) {
                            if(angular.equals({}, response.toJSON())) {
                                return $q.when(null);
                            }
                        return response;
                }));
            }
        }
        return $q.all(context);
    }];

    var organizeContext = ['statuses', 'context', function(statuses, context) {
        var statusesWithContext = [];
        for(var i = 0; i < context.length; i++) {
            if(context[i] != null) {
                statusesWithContext.push({ status: context[i], replies: [] });
            }
        }

        var individualStatuses = [];
        for(var i = 0; i < statuses.length; i++) {
            if(statuses[i].replyTo) {
                for(var j = 0; j < statusesWithContext.length; j++) {
                    if(statuses[i].replyTo == statusesWithContext[j].status.statusId) {
                        statusesWithContext[j].replies.unshift(statuses[i]);
                        break;
                    }
                    if(j == statusesWithContext.length - 1) {
                        individualStatuses.push(statuses[i]);
                        break;
                    }
                }
            } else {
                var addIt = true;
                for(var j = 0; j < statusesWithContext.length; j++) {
                    if(statuses[i].statusId == statusesWithContext[j].status.statusId) {
                        addIt = false;
                        break;
                    }
                }
                if(addIt) {
                    individualStatuses.push(statuses[i]);
                }
            }
        }
        for(var i = 0; i < individualStatuses.length; i++) {
            if(statusesWithContext.length == 0) {
                statusesWithContext.push({ status: individualStatuses[i], replies: null });
                continue;
            }

            for(var j = 0; j <= statusesWithContext.length; j++) {
                try {
                    if(statusesWithContext[j].replies != null && statusesWithContext[j].replies.length != 0) {
                        var index = statusesWithContext[j].replies.length - 1;
                        if(statusesWithContext[j].replies[index].statusDate < individualStatuses[i].statusDate) {
                            statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                            break;
                        }
                    } else {
                        if(statusesWithContext[j].status.statusDate < individualStatuses[i].statusDate) {
                            statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                            break;
                        }
                    }
                } catch(err) {
                    statusesWithContext.push({ status: individualStatuses[i], replies: null });
                    break;
                }
            }
        }

        return statusesWithContext;
    }];
    */

    $stateProvider
        .state('tatami.home', {
            url: '/home',
            abstract: true,
            templateUrl: 'app/components/home/HomeView.html',
            resolve: {
                profile: ['ProfileService', function(ProfileService) {
                    return ProfileService.get().$promise;
                }],

                userRoles: ['$http', function($http) {
                    return $http({ method: 'GET', url: '/tatami/rest/account/admin' }).then(function(result) {
                        return result.data;
                    });
                }]
            }
        })
        .state('tatami.home.status', {
            url: '/status/:statusId',
            views: {
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/components/home/status/StatusView.html',
                    controller: 'StatusController'
                }
            },
            resolve: {
                status: ['StatusService', '$stateParams', '$q', function(StatusService, $stateParams, $q) {
                    return StatusService.get({ statusId: $stateParams.statusId })
                        .$promise.then(
                            function(response) {
                                if(angular.equals({}, response.toJSON())) {
                                    return $q.reject();
                                }
                            return response;
                    });
                }],
                context: ['StatusService', '$stateParams', function(StatusService, $stateParams) {
                    return StatusService.getDetails({ statusId: $stateParams.statusId }).$promise;
                }]
            }
        })
        .state('tatami.home.search', {
            url: '/search/:searchTerm',
            views: {
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/search/SearchHeaderView.html',
                    controller: 'SearchHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                    return SearchService.query({ term: 'status', q: $stateParams.searchTerm }).$promise;
                }],
                showModal: function() {
                    return false;
                }
            }
        })
        .state('tatami.home.home', {
            url: '^/home',
            abstract: true,
            resolve: {
                groups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }],
                tags: ['TagService', function(TagService) {
                    return TagService.query({ popular: true }).$promise;
                }],
                suggestions: ['UserService', function(UserService) {
                    return UserService.getSuggestions().$promise;
                }],
                showModal: function() {
                    return false;
                }
            }
        })
        .state('tatami.home.home.timeline', {
            url: '/timeline',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', function(StatusService) {
                    return StatusService.getHomeTimeline().$promise;
                }],
                showModal: ['statuses', function(statuses) {
                    return statuses.length === 0;
                }]
            }
        })
        .state('tatami.home.home.timeline.presentation', {
            url: '',
            onEnter: ['$stateParams', '$modal', function($stateParams, $modal) {
                var $modalInstance = $modal.open({
                    templateUrl: 'app/components/home/welcome/WelcomeView.html',
                    controller: 'WelcomeController'
                })
            }]
        })
        .state('tatami.home.home.mentions', {
            url: '/mentions',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getMentions().$promise;
                }]

            }
        })
        .state('tatami.home.home.favorites', {
            url: '/favorites',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getFavorites().$promise;
                }]
            }
        })
        .state('tatami.home.home.company', {
            url: '/company',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getCompanyTimeline().$promise;
                }]//,
            }
        })
        .state('tatami.home.home.tag', {
            url: '/tag/:tag',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/tag/TagHeaderView.html',
                    controller: 'TagHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                tag: ['TagService', '$stateParams', function(TagService, $stateParams) {
                    return TagService.get({ tag: $stateParams.tag }).$promise;
                }],
                statuses: ['TagService', '$stateParams', function(TagService, $stateParams) {
                    return TagService.getTagTimeline({ tag: $stateParams.tag }).$promise;
                }]
            }
        })
        .state('tatami.home.home.group', {
            url: '/group/:groupId',
            abstract: true,
            resolve: {
                group: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.get({ groupId: $stateParams.groupId }).$promise;
                }]
            }
        })
        .state('tatami.home.home.group.statuses', {
            url: '/statuses',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.getStatuses({ groupId: $stateParams.groupId }).$promise;
                }]
            }
        })
        .state('tatami.home.home.group.members', {
            url: '/members',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                users: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.getMembers({ groupId: $stateParams.groupId }).$promise;
                }]
            }
        })
        .state('tatami.home.profile', {
            url: '/profile/:username',
            abstract: true,
            resolve: {
                user: ['UserService', '$stateParams', function(UserService, $stateParams) {
                    return UserService.get({ username: $stateParams.username }).$promise;
                }],
                tags: ['TagService', '$stateParams', function(TagService, $stateParams) {
                    return TagService.query({ popular: true, user: $stateParams.username }).$promise;
                }]
            }
        })
        .state('tatami.home.profile.statuses', {
            url: '/statuses',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', '$stateParams', function(StatusService, $stateParams) {
                    return StatusService.getUserTimeline({ username: $stateParams.username }).$promise;
                }],
                showModal: function() {
                    return false;
                }
            }
        })
        .state('tatami.home.profile.following', {
            url: '/following',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                users: ['UserService', '$stateParams', function(UserService, $stateParams) {
                    return UserService.getFollowing({ username: $stateParams.username }).$promise;
                }]
            }
        })
        .state('tatami.home.profile.followers', {
            url: '/followers',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                users: ['UserService', '$stateParams', function(UserService, $stateParams) {
                    return UserService.getFollowers({ username: $stateParams.username }).$promise;
                }]
            }
        });
    }
]);;var AccountModule = angular.module('AccountModule', [
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

AccountModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tatami.account',{
            url: '/account',
            abstract: true,
            templateUrl: 'app/components/account/AccountView.html',
            resolve: {
                profileInfo: ['ProfileService', function(ProfileService) {
                    return ProfileService.get().$promise;
                }],
                userRoles: ['$http', function($http) {
                    return $http({ method: 'GET', url: '/tatami/rest/account/admin' }).then(function(result) {
                        return result.data;
                    });
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
        .state('tatami.account.groups.main', {
            url: '',
            templateUrl: 'app/components/account/groups/GroupsView.html',
            controller: 'GroupController'
        })
        .state('tatami.account.groups.main.top', {
            url: '',
            views: {
                'create@tatami.account.groups.main': {
                    templateUrl: 'app/components/account/groups/creation/GroupsCreateView.html',
                    controller: 'GroupsCreateController'
                }
            }
        })
        .state('tatami.account.groups.main.top.list', {
            url: '',
            views: {
                'list@tatami.account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.html',
                    resolve: {
                        userGroups: ['GroupService', function(GroupService) {
                            return GroupService.query().$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('tatami.account.groups.main.top.recommended', {
            url: '/recommended',
            views: {
                'list@tatami.account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.html',
                    resolve: {
                        userGroups: ['GroupService', function(GroupService) {
                            return GroupService.getRecommendations().$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('tatami.account.groups.main.top.search', {
            url: '/search/:q',
            views: {
                'list@tatami.account.groups.main': {
                    templateUrl: 'app/components/account/groups/list/GroupsListView.html',
                    resolve: {
                        userGroups: ['SearchService', '$stateParams', function(SearchService, $stateParams) {
                            return SearchService.query({ term: 'groups', q: $stateParams.q }).$promise;
                        }]
                    },
                    controller: 'GroupsController'
                }
            }
        })
        .state('tatami.account.groups.manage', {
            url:'/:groupId',
            templateUrl: 'app/components/account/groups/manage/GroupsManageView.html',
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
        .state('tatami.account.topPosters', {
            url: '/top',
            templateUrl: 'app/components/account/topPosters/TopPostersView.html',
            resolve: {
                topPosters: ['TopPostersService', function(TopPostersService) {
                    return TopPostersService.query().$promise;
                }],

                users: ['topPosters', 'UserService', '$q', function(topPosters, UserService, $q) {
                    var temp = [];
                    for(var i = 0; i < topPosters.length; ++i) {
                        temp.push(UserService.get({ username: topPosters[i].username }).$promise);
                        temp[i].statusCount = topPosters[i].statusCount;
                    }
                    return $q.all(temp);
                }],

                userData: ['topPosters', 'users', function(topPosters, users) {
                    var statusCounts = [];
                    for(var i = 0; i < topPosters.length; ++i) {
                        statusCounts[topPosters[i].username] = topPosters[i].statusCount;
                    }

                    var temp = [];
                    for(var x = 0; x < users.length; ++x) {
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
}]);;var AdminModule = angular.module('AdminModule', []);

AdminModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('admin',{
            url: '/admin?message',
            templateUrl: '/app/components/admin/AdminView.html',
            resolve: {
                adminData: ['AdminService', '$state', function(AdminService, $state) {
                    return AdminService.get().$promise.then(function(success) {
                        return success;
                    }, function(err) {
                        if(err.status === 500) {
                            $state.transitionTo('tatami.accessdenied', null, { location: false });
                        }
                    });
                }]
            },
            controller: 'AdminController'
        })
}]);;AboutModule.controller('LicenseController', ['$scope',
    function($scope) {
        $scope.endYear = new Date().getFullYear();
    }
]);;var HomeSidebarModule = angular.module('HomeSidebarModule', []);;HomeSidebarModule.controller('HomeSidebarController', ['$scope', 'UserService', 'TagService', 'profile', 'groups', 'suggestions', 'tags',
    function($scope, UserService, TagService, profile, groups, suggestions, tags) {
        $scope.profile = profile;
        $scope.groups = groups;
        $scope.suggestions = suggestions;
        $scope.tags = tags;

        $scope.followUser = function(suggestion, index) {
            UserService.follow({ username: suggestion.username }, { friend: !suggestion.followingUser, friendShip: true }, 
                function(response) {
                    $scope.suggestions[index].followingUser = response.friend;
            });
        },

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) { 
                    $scope.tags[index].followed = response.followed;
                    $scope.$state.reload();
            });
        }
    }
]);;var ProfileSidebarModule = angular.module('ProfileSidebarModule', []);;ProfileSidebarModule.controller('ProfileSidebarController', ['$scope', 'TagService', 'user', 'tags',
    function($scope, TagService, user, tags) {
        $scope.user = user;
        $scope.tags = tags;

        $scope.followTag = function(tag, index) {
            TagService.follow({ tag: tag.name }, { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp }, 
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        }
    }
]);;HomeModule.controller('TagHeaderController', ['$scope', 'TagService', 'tag',
    function($scope, TagService, tag) {
        $scope.tag = tag;

        $scope.followUnfollowTag = function() {
            TagService.follow(
                { tag: $scope.tag.name },
                { name: $scope.tag.name, followed: !$scope.tag.followed, trendingUp: $scope.tag.trendingUp },
                function(response) {
                    $scope.tag.followed = response.followed;
                    $scope.$state.reload();
                }
            );
        }
    }
]);;HomeModule.controller('SearchHeaderController', ['$scope', '$stateParams',
    function($scope, $stateParams) {
        $scope.searchTerm = $stateParams.searchTerm;
    }
]);;HomeModule.controller('GroupHeaderController', ['$scope', 'GroupService', 'profile', 'group',
    function($scope, GroupService, profile, group) {
        $scope.profile = profile;
        $scope.group = group;

        $scope.joinLeaveGroup = function() {
            if(!$scope.group.member) {
                GroupService.join(
                    { groupId: $scope.group.groupId, username: $scope.profile.username },
                    null,
                    function(response) {
                        if(response.isMember) {
                            $scope.group.member = response.isMember;
                            $scope.$state.reload();
                        }
                    }
                );
            }

            else {
                GroupService.leave(
                    { groupId: $scope.group.groupId, username: $scope.profile.username },
                    null,
                    function(response) {
                        if(response) {
                            $scope.group.member = !response;
                            $scope.$state.reload();
                        }
                    }
                );
            }
        }
    }
]);;HomeModule.controller('ProfileHeaderController', ['$scope', 'UserService', 'user',
    function($scope, UserService, user) {
        $scope.user = user;

        $scope.followUnfollowUser = function() {
            UserService.follow(
                { username: $scope.user.username },
                { friend: !$scope.user.friend, friendShip: true },
                function(response) {
                    $scope.user.friend = response.friend;
                    $scope.$state.reload();
            });
        }
    }
]);;HomeModule.controller('StatusController', [
    '$scope',
    'StatusService',
    'profile',
    'status',
    'context',
    'userRoles',
    function($scope, StatusService, profile, status, context, userRoles) {

        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.profile = profile;

        if(context.discussionStatuses.length == 0) {
            $scope.statuses = [status];   
        } else {
            $scope.statuses = context.discussionStatuses;
        }

        for(var i = 0; i <= context.discussionStatuses.length; i++) {
            try {
                if(status.statusDate < $scope.statuses[i].statusDate) {
                    $scope.statuses.splice(i, 0, status);
                    break;
                }
            } catch(err) {
                $scope.statuses.push(status);
                break;
            }
        }

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusIdReply: status.statusId });
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.favoriteStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.statuses[index].favorite = response.favorite;
            });
        };

        $scope.shareStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        };

        $scope.announceStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { announced: true },
                function() {
                    $scope.$state.reload();
            });
        };

        $scope.deleteStatus = function(status, index, confirmMessage) {
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    if($scope.$stateParams.statusId == status.statusId) {
                        $scope.$state.transitionTo('tatami.home.home.timeline');
                    } else {
                        $scope.statuses.splice(index, 1);
                    }
            });
        };

        $scope.getShares = function(status, index) {
            if(status.type == 'STATUS' && status.shares == null) {
                StatusService.getDetails({ statusId: status.statusId }, null,
                    function(response) {
                        $scope.statuses[index].shares = response.sharedByLogins;
                });
            }
        };
    }
]);;HomeModule.controller('StatusListController', [
    '$scope',
    '$timeout',
    '$window',
    'StatusService',
    'HomeService',
    'TagService',
    'GroupService',
    'profile',
    'statuses',
    'userRoles',
    'showModal',
    'poller',
    function($scope, $timeout, $window, StatusService, HomeService, TagService, GroupService, profile, statuses, userRoles, showModal, poller) {
        if(showModal && $scope.$state.includes('tatami.home.home.timeline')) {
            $scope.$state.go('tatami.home.home.timeline.presentation');
        }

        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.profile = profile;
        $scope.statuses = statuses;
        $scope.busy = false;

        if($scope.statuses.length == 0) {
            $scope.end = true;
        } else {
            $scope.end = false;
            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
        }

        $scope.newMessages = null;
        $window.document.title = 'Tatami';

        if($scope.$state.is('tatami.home.home.timeline')) {
            var pollingDelay = 20000; // In milliseconds

            $timeout(function() {
                var argument = {};

                if($scope.statuses.length != 0) {
                    argument = { start: statuses[0].timelineId };
                }

                var statusPoller = poller.get(StatusService, {
                    action: 'getHomeTimeline',
                    delay: pollingDelay,
                    smart: true,
                    argumentsArray: [ argument ]
                });

                statusPoller.promise.then(null, null, function(response) {
                    if(response.length > 0) {
                        $scope.newMessages = response;
                        $window.document.title = 'Tatami (' + response.length + ')';
                    }
                });
            }, pollingDelay);
        }

        $scope.loadNewStatuses = function() {
            for(var i = $scope.newMessages.length - 1; i >= 0 ; i--) {
                $scope.statuses.unshift($scope.newMessages[i]);
            }
            
            $window.document.title = 'Tatami';
            $scope.newMessages = null;
        };

        var loadMoreSuccess = function(statuses) {
            if(statuses.length == 0) {
                $scope.end = true; // reached end of list
                return;
            }

            for(var i = 0; i < statuses.length; i++) {
                $scope.statuses.push(statuses[i]);
            }

            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
            $scope.busy = false;
        };

        $scope.loadMore = function() {
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            if($scope.$state.current.name == 'tatami.home.home.timeline') {
                StatusService.getHomeTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.company') {
                HomeService.getCompanyTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.mentions') {
                HomeService.getMentions({ finish: $scope.finish }, loadMoreSuccess);
            }

            /*
                Favorites are limited to 50 total per user. All 50 are loaded
                from the favorites REST endpoint at once. There is no way to use
                &finish=timelineId for favorites as of now in the backend.

                Keep this commented out until the backend is changed to allow
                for more than 50 favorites and adding &finish=timelineId to the
                REST url.
            */
            /*
            if($scope.$state.current.name == 'tatami.home.home.favorites') {
                HomeService.getFavorites({ finish: $scope.finish }, loadMoreSuccess);
            }
            */

            if($scope.$state.current.name == 'tatami.home.home.tag') {
                TagService.getTagTimeline({ tag: $scope.$stateParams.tag, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.group.statuses') {
                GroupService.getStatuses({ groupId: $scope.$stateParams.groupId, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.profile.statuses') {
                StatusService.getUserTimeline({ username: $scope.$stateParams.username, finish: $scope.finish }, loadMoreSuccess);
            }
        };

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusId: status.statusId });
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.favoriteStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.statuses[index].favorite = response.favorite;
            });
        };

        $scope.shareStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        };

        $scope.announceStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { announced: true },
                function() {
                    $scope.$state.reload();
            });
        };

        $scope.deleteStatus = function(status, index, confirmMessage) {
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.statuses.splice(index, 1);
            });
        };

        $scope.getShares = function(status, index) {
            if(status.type == 'STATUS' && status.shares == null) {
                StatusService.getDetails({ statusId: status.statusId }, null,
                    function(response) {
                        $scope.statuses[index].shares = response.sharedByLogins;
                });
            }
        };
    }
]);;HomeModule.controller('UserListController', ['$scope', 'UserService', 'users',
    function($scope, UserService, users) {
        $scope.users = users;

        $scope.followUser = function(user, index) {
            UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true }, 
                function(response) {
                    $scope.users[index].friend = response.friend;
                    $scope.$state.reload();
            });
        }
    }
]);;var PostModule = angular.module('PostModule', ['angularFileUpload', 'ui.router']);

PostModule.config(['$stateProvider', function($stateProvider) {
    var onEnterArray = ['$stateParams', '$modal', function($stateParams, $modal) {
        var $modalInstance = $modal.open({
            templateUrl: '/app/shared/topMenu/post/PostView.html',
            controller: 'PostController',
            keyboard: true,
            resolve: {
                curStatus: ['StatusService', function(StatusService) {
                    if($stateParams.statusId !== null) {
                        return StatusService.get({ statusId: $stateParams.statusId }).$promise;
                    }
                }],
                groups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }]
            }
        });
    }];

    var onEnterArrayStatusView = ['$stateParams', '$modal', function($stateParams, $modal) {
        var $modalInstance = $modal.open({
            templateUrl: '/app/shared/topMenu/post/PostView.html',
            controller: 'PostController',
            keyboard: true,
            resolve: {
                curStatus: ['StatusService', function(StatusService) {
                    if($stateParams.statusIdReply !== null) {
                        return StatusService.get({ statusId: $stateParams.statusIdReply }).$promise;
                    }
                }],
                groups: ['GroupService', function(GroupService) {
                    return GroupService.query().$promise;
                }]
            }
        });
    }];

    $stateProvider
        .state('tatami.home.status.post', {
            url: '',
            params: {
                'statusIdReply': null
            },
            onEnter: onEnterArrayStatusView
        })
        .state('tatami.home.search.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.timeline.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.mentions.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.favorites.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.company.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.tag.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.group.statuses.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.home.group.members.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.profile.statuses.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.profile.following.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('tatami.home.profile.followers.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        });
    }
]);;
PostModule.controller('PostController', [
    '$scope',
    '$modalInstance',
    '$upload',
    'StatusService',
    'GeolocalisationService',
    'groups',
    'curStatus',
    'SearchService',
    function($scope, $modalInstance, $upload, StatusService, GeolocalisationService, groups, curStatus, SearchService) {

        $scope.determineTitle = function() {
            if(angular.isDefined(curStatus)) {
                return 'tatami.home.post.replyTo'
            }
            else {
                return 'tatami.home.post.update'
            }
        };

        $scope.notArchived = function(groups) {
            var filteredGroups = [];
            for(var group in groups) {
                if(!group.archivedGroup) {
                    filteredGroups.push(group);
                }
            }
            return filteredGroups;
        };

        $scope.current = {                      // This is the current instance of the status window
            preview: false,                     // Determines if the status is being previewed by the user
            geoLoc: false,                      // Determine if the geolocalization checkbox is checked
            groups: groups,                     // The groups the user belongs to
            reply: false,                       // Determine if this status is a reply to another user
            uploadDone: true,                   // If the file upload is done, we should not show the progess bar
            uploadProgress: 0,                  // The progress of the file currently being uploaded
            upload: [],
            contentEmpty: true,
            files: [],
            attachments: []
        };

        $scope.status = {            // This is the current user status information
            content: "",             // The content contained in this status
            groupId: "",             // The groupId that this status is being broadcast to
            replyTo: "",             // The user we are replying to
            attachmentIds: [],       // An array of all the attachments contained in the status
            geoLocalization: "",     // The geographical location of the user when posting the status
            statusPrivate: false     // Determines whether the status is private
        };

        $scope.charCount = 750;

        $scope.uploadStatus = {
            isUploading: false,
            progress: 0
        };

                $scope.$watch('current.files', function() {
            if($scope.current.files != null) {
                for(var i = 0; i < $scope.current.files.length; ++i) {
                    var file = $scope.current.files[i];
                    $scope.uploadStatus.isUploading = true;
                    $scope.upload = $upload.upload({
                        url: '/tatami/rest/fileupload',
                        file: file,
                        fileFormDataName: 'uploadFile'
                    }).progress(function(evt) {
                        $scope.uploadStatus.progress = parseInt(100.0 * evt.loaded / evt.total);
                    }).success(function(data, status, headers, config) {
                        $scope.current.attachments.push(data[0]);
                        $scope.uploadStatus.isUploading = false;
                        $scope.uploadStatus.progress = 0;
                        $scope.status.attachmentIds.push(data[0].attachmentId);
                    }).error(function(data, status, headers, config) {
                        $scope.uploadStatus.isUploading = false;
                        $scope.uploadStatus.progress = 0;
                    })
                }
            }
        });

        $scope.fileSize = function(file) {
            if(file.size / 1000 < 1000) {
                return parseInt(file.size / 1000) + "K";
            }
            else{
                return parseInt(file.size / 1000000) + "M";
            }
        };
                $modalInstance.setCurrentStatus = function(status) {
            var defined = angular.isDefined(status);
            $scope.current.reply = defined;
            $scope.currentStatus = defined ? status : {};
            if(defined) {
                $scope.status.content = '@' + $scope.currentStatus.username + ' ';
                $scope.status.replyTo = status.statusId;
            }
            else {
                $scope.currentStatus.avatarURL = '/assets/img/default_image_profile.png';
            }
        };

        $modalInstance.setCurrentStatus(curStatus)

        $scope.closeModal = function() {
            $modalInstance.dismiss();
            $scope.reset();
            $scope.$state.go('^');
        };
        $modalInstance.result.finally(function() {
            $scope.$state.go('^');
        });


                $scope.statusChange = function(param) {
            $scope.status.content = param;
        };

        $scope.fetchUsers = function(term) {
            return SearchService.query({ 'term': 'users', q: term }, function(result) {
                $scope.users = result;
            })
        };

        $scope.selectUser = function(item) {
            return '@' + item.username;
        };

        $scope.fetchTags = function(term) {
            if(term.length > 0) {
                return SearchService.query({ 'term': 'tags', q: term }, function(result) {
                    $scope.tags = result;
                })
            }

        };

        $scope.selectTag = function(item) {
            return '#' + item.name;
        };


                $scope.reset = function() {
            $scope.current.preview = false;
            $scope.current.geoLoc = false;
            $scope.current.uploadDone = true;
            $scope.current.uploadProgress = 0;

            $scope.status.content = "";
            $scope.status.groupId = "";
            $scope.status.attachmentIds = [];
            $scope.status.geoLocalization = "";
            $scope.status.replyTo = "";
            $scope.status.statusPrivate = false;
        };


                $scope.newStatus = function() {
            if($scope.status.content.trim().length != 0) {
                $scope.status.content = $scope.status.content.trim();

                StatusService.save($scope.status, function() {
                    $modalInstance.close();
                    $modalInstance.result.then(function() {
                        $scope.$state.transitionTo('tatami.home.home.timeline', {}, { reload: true });
                    });
                    $scope.reset();
                })
            }
        };

        
                $scope.updateLocation = function() {
            if($scope.current.geoLoc) {
                GeolocalisationService.getGeolocalisation($scope.getLocationString);
            } else {
                $scope.status.geoLocalization = "";
            }
        };

                $scope.getLocationString = function(position) {
            $scope.status.geoLocalization = position.coords.latitude + ", " + position.coords.longitude;
            $scope.initMap();
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

                $scope.initMap = function() {
            if ($scope.current.geoLoc) {
                var geoLocalization = $scope.status.geoLocalization;
                var latitude = geoLocalization.split(',')[0].trim();
                var longitude = geoLocalization.split(',')[1].trim();

                map = new OpenLayers.Map("simpleMap");
                var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
                var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
                var lonLat = new OpenLayers.LonLat(parseFloat(longitude), parseFloat(latitude)).transform(fromProjection, toProjection);
                var mapnik = new OpenLayers.Layer.OSM();
                var position = lonLat;
                var zoom = 12;

                map.addLayer(mapnik);
                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);
                markers.addMarker(new OpenLayers.Marker(lonLat));
                map.setCenter(position, zoom);
            }
        }
    }
]);;HomeModule.controller('WelcomeController', ['$scope', '$modalInstance', '$rootScope', function($scope, $modalInstance, $rootScope) {
    $scope.close = function() {
        $modalInstance.dismiss();
    };

    $scope.launchPresentation = function() {
        $rootScope.$broadcast('start-tour');
        $modalInstance.dismiss();
    };
    $modalInstance.result.finally(function() {
        $scope.$state.go('tatami.home.home.timeline');
    })
}]);;AdminModule.controller('AdminController', [
    '$scope',
    '$translate',
    'AdminService',
    'adminData',
    function($scope, $translate, AdminService, adminData) {
        $scope.adminData = adminData;

        $scope.reindex = function() {
            if(confirm($translate.instant('tatami.admin.confirm'))) {
                AdminService.save({ options: 'reindex' });
                $scope.$state.go('admin', { message: 'reindex' });
            }
        }
}]);;AdminModule.factory('AdminService', ['$resource', function($resource) {
    return $resource('/tatami/admin/:options', { options: '@options' });
}]);;AccountModule.controller('AccountController', ['$scope', '$location', 'profileInfo', function($scope, $location, profileInfo) {
    $scope.profile = profileInfo;
}]);;AccountModule.controller('FormController', ['$scope', function($scope) {
    $scope.$on('$stateChangeSuccess', function(event, toState) {
        if(toState.name === 'tatami.account.groups') {
            $scope.$state.go('tatami.account.groups.main.top.list');
        }
        else if(toState.name === 'tatami.account.tags') {
            $scope.$state.go('tatami.account.tags.following');
        }
        else if(toState.name === 'tatami.account.users') {
            $scope.$state.go('tatami.account.users.following');
        }
    });
}]);;var ProfileModule = angular.module('ProfileModule', []);;ProfileModule.controller('ProfileController', ['$scope', '$upload', '$translate', 'ProfileService', 'profileInfo', 'userLogin', 'ngToast',
    function($scope, $upload, $translate, ProfileService, profileInfo, userLogin, ngToast) {
        $scope.current = {
            avatar: []
        };
        $scope.uploadStatus = {
            isUploading: false,
            progress: 0
        };
        $scope.userProfile = profileInfo;
        $scope.userLogin = userLogin.login;
        $scope.updateUser = function() {
            ProfileService.update($scope.userProfile, function() {
                ngToast.create({
                    content: $translate.instant('tatami.account.profile.save')
                });
            }, function() {
                ngToast.create({
                    content: $translate.instant('tatami.form.fail'),
                    class: 'danger'
                });
            });
        };
        $scope.$watch('current.avatar', function() {
            for(var i = 0; i < $scope.current.avatar.length; ++i){
                var file = $scope.current.avatar[i];
                $scope.uploadStatus.isUploading = true;
                $scope.upload = $upload.upload({
                    url: '/tatami/rest/fileupload/avatar',
                    file: file,
                    fileFormDataName: 'uploadFile'
                }).progress(function(evt) {
                    $scope.uploadStatus.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    $scope.uploadStatus.isUploading = false;
                    $scope.uploadStatus.progress = 0;
                    $scope.$state.reload();
                }).error(function(data, status, headers, config) {
                    $scope.uploadStatus.isUploading = false;
                    $scope.uploadStatus.progress = 0;
                })
            }
        });
    }
]);;var PreferencesModule = angular.module('PreferencesModule', []);;PreferencesModule.controller('PreferencesController', [
    '$scope',
    '$translate',
    'PreferencesService',
    'prefs',
    'ngToast',
    function($scope, $translate, PreferencesService, prefs, ngToast) {

        $scope.prefs = prefs;
        $scope.savePrefs = function() {
            $scope.validatePrefs();
            PreferencesService.save($scope.prefs, function() {
                ngToast.create($translate.instant('tatami.account.preferences.save'));
            }, function() {
                ngToast.create({
                    content: $translate.instant('tatami.form.fail'),
                    class: 'danger'
                })
            });
        };

        $scope.validatePrefs = function() {
            for(var pref in $scope.prefs) {
                if($scope.prefs.hasOwnProperty(pref) && $scope.prefs[pref] === null) {
                    if('rssUid' === $scope.prefs[pref]) {
                        continue;
                    }
                    $scope.prefs[pref] = false;
                }
            }
        }
}]);;PreferencesModule.factory('PreferencesService', function($resource) {
    return $resource('/tatami/rest/account/preferences');
});;var PasswordModule = angular.module('PasswordModule', []);;PasswordModule.controller('PasswordController', ['$scope', '$translate', 'PasswordService', 'ngToast', function($scope, $translate, PasswordService, ngToast) {
    $scope.password = {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
    };

        $scope.status = {
        oldEmpty: false,
        newEmpty: false,
        confirmWrong: false,
        confirmChange: false
    };

    $scope.changePassword = function() {
        if(!$scope.password.oldPassword) {
            $scope.oldEmpty = true;
        }
        else if(!$scope.password.newPassword) {
            $scope.newEmpty = true;
        }
        else if($scope.password.newPassword !== $scope.password.newPasswordConfirmation) {
            cofirmWrong = true;
        }
        else {
            PasswordService.save($scope.password, function() {
                $scope.reset();
                ngToast.create($translate.instant('tatami.account.password.save'));

            }, function() {
                ngToast.create({
                    content: $translate.instant('tatami.form.fail'),
                    class: 'danger'
                });
            });
        }
    };

    $scope.reset = function() {
        $scope.password = {};
        $scope.status.oldEmpty = false;
        $scope.status.newEmpty = false;
        $scope.status.confirmWrong = false;
    };
}]);;PasswordModule.factory('PasswordService', function($resource) {
    return $resource('/tatami/rest/account/password');
});;var FilesModule = angular.module('FilesModule', []);;FilesModule.controller('FilesController', [
    '$scope',
    '$translate',
    'FilesService',
    'attachmentQuota',
    'fileList',
    'ngToast',
    function($scope, $translate, FilesService, attachmentQuota, fileList, ngToast) {
    $scope.quota = attachmentQuota[0];
    $scope.fileList = fileList;

        $scope.delete = function(attachment, removalIndex) {
        FilesService.delete({attachmentId: attachment}, { },
            function() {
                $scope.fileList.splice(removalIndex, 1);
                $scope.$state.reload();
                ngToast.create($translate.instant('tatami.form.deleted'));
            });
    };

    $scope.getImgPath = function(thumbnail, attachmentId, filename) {
        if(thumbnail) {
            return '/tatami/thumbnail/' + attachmentId + '/' + filename;
        }
        else {
            return '/img/document_icon.png';
        }
    };

    $scope.setColor = function() {
        if($scope.quota <= 100 && $scope.quota >= 80) {
            return "progress-bar progress-bar-danger";
        }
        else if($scope.quota < 80 && $scope.quota > 50) {
            return "progress-bar progress-bar-warning";
        }
        else {
             return "progress-bar progress-bar-success";
        }
    };
}]);;FilesModule.factory('FilesService', function($resource) {
    return $resource(
        '/tatami/rest/attachments/:attachmentId',
        { },
        {
            'getQuota': { method: 'GET', isArray: true, url: '/tatami/rest/attachments/quota' }
        });
});;var UsersModule = angular.module('UsersModule', []);;UsersModule.controller('UsersController', ['$scope', 'usersList', 'SearchService', 'UserService', 'userRoles', function($scope, usersList, SearchService, UserService, userRoles) {
    $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;
        $scope.current = {
        searchString: $scope.$stateParams.q
    };
    $scope.usersList = usersList;

    $scope.deactivate = function(user, index) {
        UserService.deactivate({ username: user.username }, { activate: true }, function(response) {
            $scope.usersList[index].activated = response.activated;
        })
    };

        $scope.search = function() {
        $scope.$state.transitionTo('tatami.account.users.search',
            { q: $scope.current.searchString },
            { location: true, inherit: true, relative: $scope.$state.$current, notify: false });
        SearchService.query({ term: 'users', q: $scope.current.searchString }, function(result) {
            $scope.usersList = result;
        });
    };

    $scope.followUser = function(user) {
        UserService.follow({ username: user.username }, { friend: !user.friend, friendShip: true },
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);;var GroupsModule = angular.module('GroupsModule', []);;GroupsModule.controller('GroupsController', [
    '$scope',
    'GroupService',
    'SearchService',
    'userGroups',
    'profileInfo',
    function($scope, GroupService, SearchService, userGroups, profileInfo) {
        $scope.userGroups = userGroups;

                $scope.current = {
            searchString: $scope.$stateParams.q
        };

        $scope.search = function() {
            $scope.$state.transitionTo('tatami.account.groups.main.top.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });
            SearchService.query({term: 'groups', q: $scope.current.searchString }, function(result) {
                $scope.userGroups = result;
            });
        };

        $scope.joinLeaveGroup = function(group) {
            if(!group.member) {
                GroupService.join(
                    { groupId: group.groupId, username: profileInfo.username },
                    null,
                    function(response) {
                        if(response.isMember) {
                            $scope.$state.reload();
                        }
                    }
                );
            }

            else {
                GroupService.leave(
                    { groupId: group.groupId, username: profileInfo.username },
                    null,
                    function(response) {
                        if(response) {
                            $scope.$state.reload();
                        }
                    }
                );
            }
        };
    }
]);;GroupsModule.controller('GroupsManageController', ['$scope', 'group', 'GroupService', 'UserService', 'members', function($scope, group, GroupService, UserService, members) {
    $scope.group = group;
    $scope.members = members;
    $scope.searchedMembers = {};

    $scope.current = { searchString: '' };

    $scope.updateGroup = function() {
        GroupService.update( { groupId: $scope.group.groupId }, $scope.group);
    };

    $scope.removeUser = function(member) {
        GroupService.leave(
            { groupId: $scope.group.groupId, username: member.username },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };

    $scope.search = function() {
        if($scope.current.searchString) {
            UserService.searchUsers({ term: 'search', q: $scope.current.searchString }, function(result) {
                $scope.searchedMembers = result;
            });
        }
        else {
            $scope.searchedMembers = {};
        }
    };

    $scope.addUser = function(member) {
        GroupService.join(
            { groupId: $scope.group.groupId, username: member.username },
            null,
            function() {
                $scope.$state.reload();
            }
        );
    };
}]);;GroupsModule.controller('GroupsCreateController', ['$scope', '$translate', 'GroupService', 'ngToast', function($scope, $translate, GroupService, ngToast) {
    $scope.current = {};
        $scope.groups = {
        name: "",
        description: "",
        publicGroup: true,
        archivedGroup: false
    };

        $scope.newGroup = function() {
        $scope.current.createGroup = !$scope.current.createGroup;
    };

        $scope.cancelGroupCreate = function() {
        $scope.reset();
    };

        $scope.reset = function() {
        $scope.groups = {};
        $scope.current.createGroup = false;
    };

        $scope.createNewGroup = function() {
        GroupService.save($scope.groups, function() {
            $scope.reset();
            $scope.$state.reload();
            ngToast.create({
                content: $translate.instant('tatami.account.groups.save')
            });
        }, function() {
            ngToast.create({
                content: $translate.instant('tatami.form.fail'),
                class: 'danger'
            });
        });
    };
}]);;GroupsModule.controller('GroupController', ['$scope', function($scope) {
    if($scope.$state.name === 'tatami.account.groups.main') {
        $scope.$state.go('tatami.account.groups.main.top.list');
    }
}]);;var TagsModule = angular.module('TagsModule', []);;TagsModule.controller('TagsController', [
    '$scope',
    'TagService',
    'SearchService',
    'tagList',
    function($scope, TagService, SearchService, tagList) {
        $scope.current = {
            searchString: ''
        };

        $scope.tags = tagList;


        
        $scope.followTag = function(tag, index) {
            TagService.follow(
                { tag: tag.name },
                { name: tag.name, followed: !tag.followed, trendingUp: tag.trendingUp },
                function(response) {
                    $scope.tags[index].followed = response.followed;
            });
        };

        $scope.search = function() {
            $scope.$state.transitionTo('tatami.account.tags.search',
                { q: $scope.current.searchString },
                { location: true, inherit: true, relative: $scope.$state.$current, notify: false });
            if($scope.current.searchString.length == 0) {
                $scope.tags = {};
            }
            else{
                SearchService.query({term: 'tags', q: $scope.current.searchString }, function(result) {
                    $scope.tags = result;
                });
            }
        }
    }
]);;var TopPostersModule = angular.module('TopPostersModule', []);;TopPostersModule.controller('TopPostersController', ['$scope', 'topPosters', 'UserService', 'userData', function($scope, topPosters, UserService, userData) {
    $scope.topPosters = userData;

    $scope.topPosters.sort(function(a, b) {
        return a.statusCount < b.statusCount ? 1 : -1;
    });
}]);;LoginModule.controller('ManualLoginController', ['$scope', '$rootScope', '$http', 'AuthenticationService', 'UserSession', function($scope, $rootScope, $http, AuthenticationService, UserSession) {
    $scope.user = {};
    $scope.login = function() {
        $http({
            method: 'POST',
            url: '/tatami/authentication',
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { j_username: $scope.user.email, j_password: $scope.user.password, _spring_security_remember_me: $scope.user.remember },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data) {
            if(data.action === 'loginFailure') {
                $scope.$state.go('tatami.login.main', { action: data.action });
            }
            else {
                UserSession.setLoginState(true);
                if(angular.isDefined($rootScope.returnToState) || angular.isDefined($rootScope.returnToStateParams)) {
                    $scope.$state.go($rootScope.returnToState.name, $rootScope.returnToParams);
                }
                else {
                    $scope.$state.go('tatami.home.home.timeline');
                }

            }
        })
        .error(function(data, status, headers, config) {
            console.log('Error');
            console.log(data);
        });
    }
}]);;LoginModule.controller('RecoverPasswordController', ['$scope', 'RegistrationService', function($scope, RegistrationService) {
    $scope.user = {};

    $scope.resetPassword = function() {
        var data = 'email=' + $scope.user.email;
        RegistrationService.resetPassword(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        });
    }
}]);;LoginModule.controller('RegisterController', ['$scope', 'RegistrationService', function($scope, RegistrationService) {
    $scope.user = {};

    $scope.registerUser = function() {
        var data = 'email=' + $scope.user.email;
        RegistrationService.registerUser(data).$promise.then(function(success) {
            $scope.$state.go('tatami.login.main', { action: success.action });
            $scope.user.email = '';
        }, function(err) {
            console.log(err);
        })
    }
}]);;LoginModule.controller('GoogleLoginController', ['$scope', '$http', 'UserSession', function($scope, $http, UserSession) {
    $scope.logout = function() {
        $http.get('/tatami/logout')
            .success(function() {
                UserSession.clearSession();
                $scope.$state.go('tatami.login.main');
            });
    }
}]);;LoginModule.controller('EmailRegistrationController', ['$scope', 'RegistrationService', function($scope, RegistrationService) {
}]);;LoginModule.factory('RegistrationService', ['$resource', function($resource) {
    return $resource('/tatami/:register', null, {
        'resetPassword': {
            method: 'POST',
            url: '/tatami/lostpassword',
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        'getUpdate': {
            method: 'GET'
        },
        'registerUser': {
            method: 'POST',
            url: '/tatami/register',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    });
}]);;marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: true,
    highlight: null,
    urls: {
        youtube : function(text, url){
            var cap;
            if((cap = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/.exec(url))){
                return '<iframe width="420" height="315" src="https://www.youtube.com/embed/' +
                    cap[5] +
                    '" frameborder="0" allowfullscreen></iframe>';
            }
        },
        vimeo : function(text, url){
            var cap;
            if((cap = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.exec(url))){
                return '<iframe src="https://player.vimeo.com/video/' +
                    cap[5] +
                    '" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
            }
        },
        dailymotion : function(text, url){
            var cap;
            if((cap = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/.exec(url))){
                return '<iframe frameborder="0" width="480" height="271" src="https://www.dailymotion.com/embed/video/' +
                    cap[2] +
                    '"></iframe>';
            }
        },
        gist : function(text, url){
            var cap;
            if((cap = /^.+gist.github.com\/(([A-z0-9-]+)\/)?([0-9A-z]+)/.exec(url))){
                $.ajax({
                    url: cap[0] + '.json',
                    dataType: 'jsonp',
                    success: function(response){
                        if(response.stylesheet && $('link[href="' + response.stylesheet + '"]').length === 0){
                            var l = document.createElement("link"),
                                head = document.getElementsByTagName("head")[0];

                            l.type = "text/css";
                            l.rel = "stylesheet";
                            l.href = response.stylesheet;
                            head.insertBefore(l, head.firstChild);
                        }
                        var $elements = $('.gist' + cap[3]);
                        $elements.html(response.div);
                    }
                });
                return '<div class="gist' + cap[3] + '"/>';
            }
        }
    }
});;TatamiApp.run(['amMoment', function(amMoment) {
    amMoment.changeLocale('en');
}]);

moment.locale('en', {
    relativeTime : {
        future: "",
        past:   "%s",
        s:  "1s",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1mo",
        MM: "%dmo",
        y:  "1y",
        yy: "%dy"
    }
});

/*
moment.locale('fr', {
    relativeTime : {
        future: "",
        past:   "%s",
        s:  "1d",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1j",
        dd: "%dj",
        M:  "1m",
        MM: "%dm",
        y:  "1a",
        yy: "%da"
    }
});
*/;TatamiApp.config(['$translateProvider', function($translateProvider) {
  
    $translateProvider.translations('en', {
        'tatami': {
            'pageNotFound': 'Page not found.',
            'error': 'An error has occurred.',

            'welcome': {
                'title': 'Welcome to Tatami',
                'message': 'Your timeline is empty! Do you need help to learn how to use Tatami? Please click on the button below to launch a presentation.',
                'presentation': 'Launch presentation',
                'help': {
                    'title': 'Help',
                    'line1': 'Welcome to the online help!',
                    'line2':' Follow the next steps for a tour of the main Tatami features.'
                },
                'timeline': {
                    'title': 'Timeline',
                    'line1': 'This is your timeline. It displays all messages',
                    'bulletPoint1': 'mentioning you or sent privately to you',
                    'bulletPoint2': 'sent by users you follow',
                    'bulletPoint3': 'sent by yourself',
                    'bulletPoint4': 'sent to group you are subscribed to',
                    'afterBP1': 'If it\'s empty, don\'t worry, it will get updated as soon as you start following other users!',
                    'afterBP2': 'When viewing a message, you can reply to it and mark it as a favorite to find it easily later.',
                    'afterBP3': 'If a message already has some replies, you can see them all by clicking on the timestamp or clicking \'View Conversation\'.'
                },
                'post': {
                    'title': 'Posting Messages',
                    'line1': 'Here is where you write messages you want to share',
                    'bulletPoint1': 'All messages are public by default. They will be delivered to all users who follow you.',
                    'bulletPoint2': 'When writing a message you should use <\i>#hashtags</i>. This simply means adding a # at the beginning of important words that can be used to find your message.',
                    'bulletPoint3': 'When mentioning or replying to other users you should add a @ at the beginning of their name. They will be notified that you are talking to them.'
                },
                'groups': {
                    'title': 'Groups',
                    'line1': 'This is the list of groups you are a member of.',
                    'line2': 'You can find and subscribe to public groups in the Account/Groups page (top-right menu).',
                    'line3': 'There are also private groups. You cannot subscribe to these. The owner of the group must add you as a member.'
                },
                'trends': {
                    'title': 'Trends',
                    'line1': 'This list represents the #hashtags that are currently the most often used on Tatami. Use this to discover what\'s going on and what are the hottest topics on Tatami!'
                },
                'whoToFollow': {
                    'title': 'Who To Follow',
                    'line1': 'This is a list of users who share common interests with you and who you could follow.',
                    'line2': 'If you are a new user, this list is probably empty. Tatami needs some time to learn who you are in order to suggest relevant users.',
                    'line3': 'And don\'t forget to use #hashtags in your messages. It makes everything easier!'
                },
                'next': 'Next',
                'previous': 'Prev',
                'end': 'End'
            },
            'login': {
                'title': 'Login',
                'mainTitle': 'Welcome to Tatami',
                'subtitle': 'An open source enterprise social network',
                'moreInfo': 'More Info',
                'email': 'Email',
                'password': 'Password',
                'remember': 'Remember me',
                'forgotPassword': 'Forgot your password?',
                'resetPassword': 'Reset password',
                'tos': 'Terms of Service',
                'fail': 'Your authentication has failed! Are you sure you used the correct password?',
                'passwordEmailSent': 'An e-mail has been sent to you, with instructions to generate a new password.',
                'unregisteredEmail': 'This e-mail address is not registered in Tatami.',
                'register': {
                    'title': 'Register',
                    'line1': 'A confirmation email will be sent to the address you provide.',
                    'line2': "Your email's domain will determine the company space you join. For example, users with an email@ippon.fr address will join Ippon's private space.",
                    'line3': "If you are the first employee of your company to join Tatami, your company's private space will be automatically created."
                },
                'googleApps': {
                    'title': 'Google Apps Login',
                    'line1': 'This feature is for Google Apps for Work users, who have their work domain name managed by Google Apps.',
                    'link': 'For more information on Google Apps for Work click here.',
                    'line2': 'Whether or not you already have a Tatami account, you can sign in with your Google Apps account.',
                    'line3': "Your email will be provided by Google and your email's domain name will be used to allow you to join your company's private space.",
                    'login': 'Login using Google Apps'
                },
                'validation': 'E-mail validation',
                'passwordSuccess': 'Your e-mail has been validated. Your password will be e-mailed to you.',
                'returnHome': 'Go to the home page',
                'registrationEmail': 'Thank you! A registration e-mail has been sent to you.'
            },

            'about': {
                'presentation': {
                    'title': 'What is Tatami?',
                    'devices': 'Devices',
                    'openSource': 'Open Source',
                    'row1': {
                        'title': 'A private, enterprise social network',
                        'line1': 'Update your status to inform your co-workers',
                        'line2': "Subscribe to other employees' time lines",
                        'line3': 'Share important information to your followers',
                        'line4': 'Discuss and reply to your colleagues',
                        'line5': 'Put important information into favorites',
                        'line6': 'Search useful information with our integrated search engine',
                        'line7': 'Use hashtags to find related information',
                        'line8': "Go to your co-workers' profiles to see what they are working on",
                        'line9': 'English and French versions available, adding other languages is easy'
                    },
                    'row2': {
                        'title': 'Works on all devices!',
                        'line1': 'Dynamic web application (HTML5): nothing to install, except a modern browser!',
                        'line2': "Works on mobile devices, tablets, or standard computers: the application adapts itself automatically to your device's screen",
                        'line3': 'Stay connected with your enterprise wherever you are'
                    },
                    'row3': {
                        'title': "Easy installation and integration with your company's IT infrastructure",
                        'line1': 'Standard Java application',
                        'line2': 'Your data belongs to you, not to your SaaS vendor!',
                        'line3': 'Integrates with your LDAP directory',
                        'line4': 'Integrates with Google Apps',
                        'line5': 'Fully Open Source, with a business-friendly Apache 2.0 license',
                        'line6': 'Easy to extend or modify according to your needs',
                        'line7': 'High performance (based on Apache Cassandra), even on small hardware',
                        'line8': 'Join the project and submit patches on our Github page:'
                    },
                    'row4': {
                        'title': "Also available in SaaS mode, fully managed by Ippon Technologies",
                        'line1': "If you do not want to install Tatami in your company, it's easy to use directly",
                        'line2': 'Secured multi-enterprise mode: every company has its own private space',
                        'line3': '256 bits SSL encryption: all data transfers are fully secured'
                    },
                    'row5': {
                        'title': 'Need more information on our product?',
                        'line1': 'Our sales team is looking forward to hearing from you! Call us at +33 01 46 12 48 48 or email us at'
                    }
                },
                'tos': {
                    'title': 'Terms of Service'
                },
                'license': {
                    'title': 'Source Code License',
                    'copyright': 'Copyright'
                }
            },
            'home': {
                'timeline': 'Timeline',
                'mentions': 'Mentions',
                'favorites': 'Favorites',
                'companyTimeline': 'Company Timeline',

                'newMessage': 'New Message',
                'newMessages': 'New Messages',
                'menu': {
                    'logo': 'Ippon Technologies Logo',
                    'title': 'Tatami',
                    'about': {
                        'title': 'About',
                        'presentation': 'Presentation',
                        'tos': 'Terms of Service',
                        'language': {
                            'language': 'Language',
                            'en': 'English',
                            'fr': 'Français'
                        },
                        'license': 'Source Code License',
                        'github': {
                            'issues': 'Submit a Bug Report',
                            'fork': 'Fork Tatami on Github'
                        },
                        'ippon': {
                            'website': 'Ippon Technologies Website',
                            'blog': 'Ippon Technologies Blog',
                            'twitter': 'Follow @ippontech on Twitter'
                        }
                    },
                    'search': 'Search',
                    'help': 'Help',
                    'account': {
                        'title': 'Account',
                        'companyTimeline': 'Company Timeline',
                        'logout': 'Logout'
                    }
                },
                'post': {
                    'mandatory': 'Comment is mandatory',
                    'content': {
                        'mandatory': 'Please fill out this field.'
                    },
                    'update': 'Update your status',
                    'replyTo': 'Reply',
                    'preview': 'Preview',
                    'edit': 'Edit',
                    'characters': {
                        'left': 'Characters Left:'
                    },
                    'options': 'Options',
                    'shareLocation': 'Share Location',
                    'group': 'Group',
                    'reply': 'Reply to this status',
                    'files': 'Files',
                    'drop': {
                        'file': 'Drop your files here'
                    },
                    'markdown': 'Markdown Supported',
                    'button': 'Post'
                },
                'sidebar': {
                    'myGroups': 'My Groups',
                    'whoToFollow': 'Who To Follow',
                    'trends': 'Trends',
                    'public': 'PUB',
                    'private': 'PVT',
                    'archived': 'ARC',
                    'administrator': 'A',
                    'publicToolTip': 'Public Group',
                    'privateToolTip': 'Private Group',
                    'archivedToolTip': 'Archived Group',
                    'administratorToolTip': 'You administer this group.'
                },
                'status': {
                    'replyTo': 'In reply to',
                    'private': 'Private Message',
                    'reply': 'Reply',
                    'share': 'Share',
                    'favorite': 'Favorite',
                    'delete': 'Delete',
                    'confirmDelete': 'Are you sure you want to delete this status?',
                    'sharedYour': 'shared your status',
                    'followed': 'followed you',
                    'shared': 'shared',
                    'groupAdmin': 'Group Administrator',
                    'announce': 'Announce',
                    'isAnnounced': 'Announced by',
                    'viewConversation': 'View Conversation',
                    'shares': 'Shares'
                },
                'tag': {
                    'title': 'Tag',
                    'follow': 'Follow',
                    'following': 'Following',
                    'unfollow': 'Unfollow'
                },
                'group': {
                    'join': 'Join',
                    'joined': 'Joined',
                    'leave': 'Leave',
                    'manage': 'Manage',
                    'statuses': 'Statuses',
                    'members': 'Members',
                    'membersSingular': '1 Member',
                    'membersPlural': '{{ amount }} Members'
                },
                'profile': {
                    'statuses': 'Statuses',
                    'following': 'Following',
                    'followers': 'Followers',
                    'follow': 'Follow',
                    'unfollow': 'Unfollow',
                    'followsYou': 'Follows You',

                    'youStatusesSingular': 'Your 1 status',
                    'youStatusesPlural': 'Your {{ amount }} statuses',
                    'youFollowingSingular': 'You follow 1 person',
                    'youFollowingPlural': 'You follow {{ amount }} people',
                    'youFollowersSingular': 'Your 1 follower',
                    'youFollowersPlural': 'Your {{ amount }} followers',

                    'userStatusesSingular': '@{{ username }} posted 1 status',
                    'userStatusesPlural': '@{{ username }} posted {{ amount }} statuses',
                    'userFollowingSingular': '@{{ username }} follows 1 person',
                    'userFollowingPlural': '@{{ username }} follows {{ amount }} people',
                    'userFollowersSingular': '@{{ username }} has 1 follower',
                    'userFollowersPlural': '@{{ username }} has {{ amount }} followers',

                    'deactivatedUser': 'Deactivated User',
                    'sidebar': {
                        'information': 'Information',
                        'statistics': 'Statistics',
                        'firstName': 'First Name',
                        'lastName': 'Last Name',
                        'email': 'Email',
                        'jobTitle': 'Job Title',
                        'phoneNumber': 'Phone Number',
                        'statuses': 'Statuses',
                        'following': 'Following',
                        'followers': 'Followers',
                        'trends': 'Trends'
                    }
                },

                'searchPage': {
                    'title': 'Search',
                    'statusesWith': 'Statuses with'
                }
            },
            'account': {
                'profile': {
                    'title': 'Profile',
                    'dropPhoto': 'Drop your photo here to update it',
                    'update': 'Update your profile',
                    'email': 'Email',
                    'firstName': 'First Name',
                    'lastName': 'Last Name',
                    'jobTitle': 'Job Title',
                    'phoneNumber': 'Phone Number',
                    'delete': 'Delete your account',
                    'confirmDelete': 'You are about to delete your account. Are you sure?',
                    'save': 'Your profile has been saved'
                },
                'preferences': {
                    'title': 'Preferences',
                    'notifications': 'Notifications',
                    'notification': {
                        'email': {
                            'mention': 'Get notified by email when you are mentioned',
                            'dailyDigest': 'Get a daily digest email',
                            'weeklyDigest': 'Get a weekly digest email'
                        },
                        'rss': {
                            'timeline': 'Allow RSS feed publication of your timeline',
                            'link': 'Link to your timeline RSS stream'
                        }
                    },
                    'save': 'Your preferences have been saved'
                },
                'password': {
                    'title': 'Password',
                    'update': 'Update your password',
                    'old': 'Old Password',
                    'new': 'New Password',
                    'confirm': 'Confirm New Password',
                    'save': 'Your password has been changed'
                },
                'files': {
                    'title': 'Files',
                    'filename': 'Filename',
                    'size': 'Size',
                    'date': 'Date',
                    'delete': 'Delete'
                },
                'users': {
                    'title': 'Users',
                    'following': 'Following',
                    'recommended': 'Recommended',
                    'search': 'Search',
                    'deactivated': 'This user is deactivated'
                },
                'groups': {
                    'title': 'Groups',
                    'createNewGroup': 'Create a new group',
                    'name': 'Name',
                    'description': 'Description',
                    'public': 'Public',
                    'private': 'Private',
                    'publicWarning': 'Warning: If this group is public, everybody can access it',
                    'create': 'Create',
                    'myGroups': 'My Groups',
                    'recommended': 'Recommended',
                    'search': 'Search',
                    'group': 'Group',
                    'access': 'Access',
                    'members': 'Members',
                    'manage': 'Manage',
                    'update': 'Update group details',
                    'archive': 'Do you want to archive this group?',
                    'allowArchive': 'Yes, this group should be archived',
                    'denyArchive': 'No, this group is still in use',
                    'archiveWarning': 'Warning: Archived groups are read-only',
                    'addMember': 'Add a member',
                    'username': 'Username',
                    'role': 'Role',
                    'admin': 'Administrator',
                    'member': 'Member',
                    'join': 'Join',
                    'joined': 'Joined',
                    'leave': 'Leave',
                    'archived': 'Archived',
                    'add': 'Add',
                    'remove': 'Remove',
                    'save': 'Your group has been created'
                },
                'tags': {
                    'title': 'Tags',
                    'trends': 'Trends',
                    'search': 'Search',
                    'tag': 'Tag',
                    'follow': 'Follow',
                    'following': 'Following',
                    'unfollow': 'Unfollow'
                },
                'topPosters': {
                    'title': 'Top Posters',
                    'username': 'Username',
                    'count': 'Status Count'
                }
            },

            'form': {
                'cancel': 'Cancel',
                'save': 'Save',
                'success': 'The form has been successfully saved.',
                'fail': 'Failed to save form.',
                'deleted': 'Your file has been deleted.'
            },

            'admin': {
                'title': 'Administration Dashboard',
                'registered': 'Registered Enterprises',
                'domain': 'Domain',
                'count': '# of users',
                'environment': 'Environnement Variables (from tatami.properties)',
                'propery': 'Property',
                'value': 'Value',
                'reindex': 'Re-index Search Engine',
                'confirm': 'Are you sure you want to re-index Search Engine?',
                'success': 'Search engine re-indexation has succeeded.',
                'deactivate': 'Deactivate',
                'activate': 'Activate'
            }
        }
    });

    $translateProvider.translations('fr', {
        'tatami': {
            'error': 'Il y a une erreur',
            'pageNotFound': 'Page non trouvée.',

            'welcome': {
                'title': 'Bienvenue à Tatami',
                'message': 'Votre timeline est vide! Avez-vous besoin d\'aide pour apprendre à utilizer Tatami? Veuillez clicker sur le bouton ci-dessous pour lancer une présentation.',
                'presentation': 'Lancer la présentation',
                'help': {
                    'title': 'Aide',
                    'line1': 'Bienvenue à l\'aide en ligne!',
                    'line2':' Suivez les étapes suivantes pour une tournée des principales caractéristiques de Tatami .'
                },
                'timeline': {
                    'title': 'Timeline',
                    'line1': 'Ceci est votre timeline. Il affiche tous les messages',
                    'bulletPoint1': 'vous mentionner ou envoyé en privé à vous',
                    'bulletPoint2': 'envoyé par les utilisateurs que vous suivez',
                    'bulletPoint3': 'envoyé par vous-même ',
                    'bulletPoint4': 'envoyé à un groupe que vous êtes abonné',
                    'afterBP1': 'Si elle est vide, ne vous inquiétez pas, elle sera mise à jour dès que vous commencez à suivre d\'autres utilisateurs!',
                    'afterBP2': 'Lors de l\'affichage d\'un message, vous pouvez y répondre et la marquer comme favori pour le retrouver plus facilement.',
                    'afterBP3': 'Si un message avait déjà obtenu quelques réponses, vous pouvez voir tous les détails en cliquant sur detail: ce sera plus facile de suivre la conversation sur Tatami.'
                },
                'post': {
                    'title': 'Envoyer un message',
                    'line1': 'C\'est ici que vous écrivez vos messages que vous souhaitez partager',
                    'bulletPoint1': 'tous les messages sont publiques par défaut. Ils seront livrés à tous les utilisateurs qui vous suivent',
                    'bulletPoint2': 'pour écrire un message, vous devez utiliser #hashtags: cela signifie tout simplement l\'ajout d\'un «#» au début de mots importants qui peut être utilisé pour trouver votre message',
                    'bulletPoint3': 'en mentionnant, ou répondre à d\'autres utilisateurs, vous devez ajouter un @ au début de leur nom: ils seront informés que vous vous adressez à eux'
                },
                'groups': {
                    'title': 'Groupes',
                    'line1': 'Ceci est la liste des groupes que vous êtes un membre de.',
                    'line2': 'Vous pouvez trouver et vous abonner à, groupe public dans la page Account/Groupes (menu en haut à droite).',
                    'line3': 'Il y a aussi des groupes privés: pour eux vous ne pouvez pas vous inscrire: le propriétaire du groupe doit vous ajouter en tant que membre.'
                },
                'trends': {
                    'title': 'Tendances',
                    'line1': 'Cette liste représente les #hashtag qui sont les plus souvent utilisés sur Tatami. Utilisez-le pour découvrir ce qui ce passe et quels sont les sujets les plus chauds sur Tatami!'
                },
                'whoToFollow': {
                    'title': 'Utilisateurs suggérées',
                    'line1': 'Ceci est une liste d\'utilisateurs qui partagent des intérêts communs avec vous et que vous pourriez suivre.',
                    'line2': 'Si vous êtes un nouvel utilisateur, cette liste est probablement vide: Tatami a besoin de temps pour apprendre qui vous êtes afin de vous proposer des utilisateurs',
                    'line3': 'Et n\'oubliez pas d\'utiliser des #hashtags dans vos messages, il rend tout plus facile!'
                },
                'next': 'Suivant',
                'previous': 'Précédent',
                'end': 'Fin'
            },
            'login': {
                'title': 'Login',
                'mainTitle': 'Bienvenue à Tatami',
                'subtitle': 'Un réseau social d\'entreprise open source',
                'moreInfo': 'Plus d\'info',
                'email': 'Email',
                'password': 'Mot de passe',
                'remember': 'Souviens-moi',
                'forgotPassword': 'Mot de passe oublié?',
                'resetPassword': 'Nouveau mot de passe',
                'tos': 'Conditions de service',
                'fail': 'Votre authentification a échoué! Etes-vous sûr que vous avez utilisé un mot de passe correct?',
                'passwordEmailSent': 'Un e-mail vous a été envoyé, avec des instructions pour générer un nouveau mot de passe.',
                'unregisteredEmail': 'Cette adresse e-mail n\'est pas enregistré avec Tatami.',
                'register': {
                    'title': 'Enregistré',
                    'line1': 'Un email de confirmation sera envoyé à l\'adresse que vous fournissez.',
                    'line2': "Le domaine de votre email détermine l'espace de l'entreprise que vous allez rejoindre. Par exemple, les utilisateurs ayant une adresse email@ippon.fr vont joindre l'espace privées de Ippon.",
                    'line3': "Si vous êtes le premier employé de votre entreprise à se joindre à Tatami, l'espace privé de votre entreprise sera automatiquement créé."
                },
                'googleApps': {
                    'title': 'Google Apps Login',
                    'line1': 'Cette fonction est pour les utilisateurs de Google Apps pour de travail, qui ont leur nom de domaine de travail géré par Google Apps.',
                    'link': 'Pour plus d\'informations sur Google Apps pour le travail, cliquez ici.',
                    'line2': 'Si oui ou non vous avez déjà un compte Tatami, vous pouvez vous connecter avec votre compte Google Apps.',
                    'line3': "Votre e-mail sera fourni par Google et le nom du domaine de votre e-mail sera utilisé pour vous permettre de rejoindre l'espace privé de votre entreprise.",
                    'login': 'Login avec Google Apps'
                },

                'validation': 'Validation e-mail',
                'passwordSuccess': 'Votre e-mail a été validé. Votre mot de passe sera envoyé par e-mail à vous.',
                'returnHome': 'Allez à la page d\'accueil',
                'registrationEmail': 'Merci! Une inscription e-mail a été envoyé vers vous.'
            },

            'about': {
                'presentation': {
                    'title': 'Qu\'est-ce que c\'est Tatami?',
                    'devices': 'Appareils',
                    'openSource': 'Open Source',
                    'row1': {
                        'title': 'Un réseau social d\'entreprise privée',
                        'line1': 'Mettre à jour votre statut afin d\'informer vos collègues',
                        'line2': "Abonnez-vous aux timeline des autres employés",
                        'line3': 'Partager des informations importantes au personnes qui vous suivent',
                        'line4': 'Discuter et répondre à vos collègues',
                        'line5': 'Mettez des informations importantes à vos favoris',
                        'line6': 'Rechercher des informations utiles avec notre moteur de recherche intégré',
                        'line7': 'Utilisez hashtags trouver des informations associé',
                        'line8': "Aller aux profils de vos collègues pour voir ce qu'ils travaillent sur",
                        'line9': 'Des version Anglaise et Française sont disponible, c\'est aussi facile d\'ajouter d\'autre langue'
                    },
                    'row2': {
                        'title': 'Fonctionne sur tous les appareils!',
                        'line1': 'Application web dynamique (HTML5): rien à installer, à l\'exception d\'un navigateur moderne!',
                        'line2': "Fonctionne sur les appareils mobiles, des tablets ou des ordinateurs: l'application s'adapte automatiquement à l'écran de votre appareil",
                        'line3': 'Restez connecté avec votre entreprise où que vous soyez'
                    },
                    'row3': {
                        'title': "Installation et intégration facile avec l'infrastructure informatique de votre entreprise",
                        'line1': 'Application standard Java',
                        'line2': 'Vos données vous appartient, pas à votre fournisseur SaaS!',
                        'line3': 'Intégration avec votre dossier LDAP',
                        'line4': 'Intégration avec Google Apps',
                        'line5': 'Entièrement Open Source, avec une licence Apache 2.0, qui est sympa pour les entreprises',
                        'line6': 'Facile à étendre ou modifier selon vos besoins',
                        'line7': 'Haute performance (basé sur Cassandra d\'Apache), même sur les petits hardware',
                        'line8': 'Rejoignez le projet et proposer des patches sur notre page Github:'
                    },
                    'row4': {
                        'title': "Egalement disponible en mode SaaS, entièrement géré par Ippon Technologies",
                        'line1': "Si vous ne souhaitez pas installer Tatami dans votre entreprise, il est facile de l'utiliser directement",
                        'line2': 'Mode multi-entreprise sécurisé: chaque entreprise dispose de son propre espace privé',
                        'line3': 'Cryptage SSL 256 bits: tous les transferts de données sont entièrement sécurisé'
                    },
                    'row5': {
                        'title': 'Besoin de plus d\'informations sur notre produit?',
                        'line1': 'Notre équipe de vente est impatient de vous entendre! Appelez-nous au +33 01 46 12 48 48 ou par courriel à'
                    }
                },
                'tos': {
                    'title': 'Conditions de service'
                },
                'license': {
                    'title': 'Licence du source code',
                    'copyright': 'Droit d\'auteur'
                }
            },
            'home': {
                'timeline': 'Timeline',
                'mentions': 'Mentions',
                'favorites': 'Favoris',
                'companyTimeline': 'Timeline de votre entreprise',

                'newMessage': 'Nouveau Message',
                'newMessages': 'Nouveau Messages',
                'menu': {
                    'logo': 'Ippon Technologies Logo',
                    'title': 'Tatami',
                    'about': {
                        'title': 'Information',
                        'presentation': 'Présentation',
                        'tos': 'Conditions de service',
                        'language': {
                            'language': 'Language',
                            'en': 'English',
                            'fr': 'Français'
                        },
                        'license': 'License du source code',
                        'github': {
                            'issues': 'Envoyer un rapport de bug',
                            'fork': 'Fork Tatami sur Github'
                        },
                        'ippon': {
                            'website': 'Site d\'Ippon Technologies',
                            'blog': 'Blog d\'Ippon Technologies Blog',
                            'twitter': 'Suivez @ippontech sur Twitter'
                        }
                    },
                    'search': 'Recherchez',
                    'help': 'Aide',
                    'account': {
                        'title': 'Compte',
                        'companyTimeline': 'Timeline de votre enterprise',
                        'logout': 'Déconnexion'
                    }
                },
                'post': {
                    'mandatory': 'Commentaire est obligatoire',
                    'content': {
                        'mandatory': 'S\'il vous plaît remplir ce champ..'
                    },
                    'update': 'Mettre à jour votre statut',
                    'replyTo': 'Répondre',
                    'preview': 'Prévisualisation',
                    'edit': 'Editer',
                    'characters': {
                        'left': 'Caractères restants:'
                    },
                    'options': 'Options',
                    'shareLocation': 'Partager votre localisation',
                    'group': 'Groupe',
                    'reply': 'Répondre à ce statut',
                    'files': 'Fichiers',
                    'drop': {
                        'file': 'Déposez vos fichiers ici'
                    },
                    'markdown': 'Markdown Supported',
                    'button': 'Post'
                },
                'sidebar': {
                    'myGroups': 'Mes Groupes',
                    'whoToFollow': 'Qui Suivre',
                    'trends': 'Tendances',
                    'public': 'PUB',
                    'private': 'PVT',
                    'archived': 'ARC',
                    'administrator': 'A',
                    'publicToolTip': 'Groupe public',
                    'privateToolTip': 'Groupe privé',
                    'archivedToolTip': 'Groupe archivé',
                    'administratorToolTip': 'Vous administrez ce groupe.'
                },
                'status': {
                    'replyTo': 'En réponse à',
                    'private': 'Message privé',
                    'reply': 'Répondre',
                    'share': 'Partager',
                    'favorite': 'Favoris',
                    'delete': 'Suprimez',
                    'confirmDelete': 'Êtes-vous sûr de vouloir supprimer ce statut?',
                    'sharedYour': 'a partagé votre statut',
                    'followed': 'vous suit',
                    'shared': 'partagé',
                    'groupAdmin': 'Administrateur du groupe',
                    'announce': 'Annoncer',
                    'isAnnounced': 'Annoncé par',
                    'viewConversation': 'Voir La Conversation',
                    'shares': 'Partages'
                },
                'tag': {
                    'title': 'Tag',
                    'follow': 'Abonnés',
                    'following': 'Abonnements',
                    'unfollow': 'Se désabonné'
                },
                'group': {
                    'join': 'Joindre',
                    'joined': 'Joined',
                    'leave': 'Quitter',
                    'manage': 'Gérer',
                    'statuses': 'Statuts',
                    'members': 'Membres',
                    'membersSingular': '1 Membre',
                    'membersPlural': '{{ amount }} Membres'
                },
                'profile': {
                    'statuses': 'Statuts',
                    'following': 'Abonnement',
                    'followers': 'Abonnés',
                    'follow': 'Suivre',
                    'unfollow': 'Se désabonner',
                    'followsYou': 'Vous suivre',

                    'youStatusesSingular': 'Votre 1 statut',
                    'youStatusesPlural': 'Vos {{ amount }} statuts',
                    'youFollowingSingular': 'Vous êtes abonné à 1 personne',
                    'youFollowingPlural': 'Vous êtes abonné à {{ amount }} personnes',
                    'youFollowersSingular': '1 personne vous suivre',
                    'youFollowersPlural': '{{ amount }} personnes vous suivre',

                    'userStatusesSingular': '@{{ username }} a partagé un statut',
                    'userStatusesPlural': '@{{ username }} a partagé {{ amount }} statuts',
                    'userFollowingSingular': '@{{ username }} suit 1 personne',
                    'userFollowingPlural': '@{{ username }} suit {{ amount }} personnes',
                    'userFollowersSingular': '@{{ username }} a 1 abonnement',
                    'userFollowersPlural': '@{{ username }} a {{ amount }} abonnements',

                    'deactivatedUser': 'Désactivé l\'utilisateur',
                    'sidebar': {
                        'information': 'Information',
                        'statistics': 'Statistiques',
                        'firstName': 'Prénom',
                        'lastName': 'Nom',
                        'email': 'Email',
                        'jobTitle': 'Titre du travail',
                        'phoneNumber': 'Numero de telephone',
                        'statuses': 'Statuts',
                        'following': 'Abonnement',
                        'followers': 'Abonné',
                        'trends': 'Tendances'
                    }
                },

                'searchPage': {
                    'title': 'Recherchez',
                    'statusesWith': 'Statuts avec'
                }
            },
            'account': {
                'profile': {
                    'title': 'Profil',
                    'dropPhoto': 'Déposez votre photo ici pour la mettre à jour',
                    'update': 'Mettez à jour votre profil',
                    'email': 'Email',
                    'firstName': 'Prénom',
                    'lastName': 'Nom',
                    'jobTitle': 'Titre de travail',
                    'phoneNumber': 'Numero de telephone',
                    'delete': 'Supprimez votre compte',
                    'confirmDelete': 'Vous êtes sur le point de supprimer votre compte. Êtes-vous sûr?',
                    'save': 'Votre profil a été sauvé'
                },
                'preferences': {
                    'title': 'Preferences',
                    'notifications': 'Notifications',
                    'notification': {
                        'email': {
                            'mention': 'Recevez une notification par email lorsque vous êtes mentionné',
                            'dailyDigest': 'Obtenez un résumé quotidien email',
                            'weeklyDigest': 'Obtenez un sommaire hebdomadaire email'
                        },
                        'rss': {
                            'timeline': 'Autoriser RSS publication de votre fils d\'actualité',
                            'link': 'Lien de votre RSS fils d\'actualité'
                        }
                    },
                    'save': 'Vos préférences ont été sauvegardées'
                },
                'password': {
                    'title': 'Mot de passe',
                    'update': 'Changez votre mot de passe',
                    'old': 'Ancien mot de passe',
                    'new': 'Nouveau mot de passe',
                    'confirm': 'Confirmer votre nouveau mot de passe',
                    'save': 'Votre mot de passe a été changé'
                },
                'files': {
                    'title': 'Fichier',
                    'filename': 'Nom de fichier',
                    'size': 'Taille',
                    'date': 'Date',
                    'delete': 'Supprimez'
                },
                'users': {
                    'title': 'Utilisateur',
                    'following': 'Abonné',
                    'recommended': 'Recommendé',
                    'search': 'Recherchez',
                    'deactivated': 'Cet utilisateur est désactivé'
                },
                'groups': {
                    'title': 'Groupes',
                    'createNewGroup': 'Créer un nouveau groupe',
                    'name': 'Nom',
                    'description': 'Description',
                    'public': 'Public',
                    'private': 'Privé',
                    'publicWarning': 'Attention: Si ce groupe est public, tout le monde peut y accéder',
                    'create': 'Créer',
                    'myGroups': 'Mes Groupes',
                    'recommended': 'Recommandé',
                    'search': 'Rechercher',
                    'group': 'Groupe',
                    'access': 'Accès',
                    'members': 'Membres',
                    'manage': 'Gérer',
                    'update': 'Mettre à jour let détails de votre groupe',
                    'archive': 'Voulez-vous archiver ce groupe?',
                    'allowArchive': 'Oui, ce groupe devrait être archivée',
                    'denyArchive': 'Non, ce groupe est encore en usage',
                    'archiveWarning': 'Attention: Groupe archivé sont en lecture seule',
                    'addMember': 'Ajouter un member',
                    'username': 'Username',
                    'role': 'Rôle',
                    'admin': 'Administrator',
                    'member': 'Membre',
                    'join': 'Joindre',
                    'joined': 'Joignit',
                    'leave': 'Quitter',
                    'archived': 'Archivé',
                    'add': 'Ajouter',
                    'remove': 'Supprimer',
                    'save': 'Votre groupe a été créé'
                },
                'tags': {
                    'title': 'Tags',
                    'trends': 'Tendances',
                    'search': 'Recherchez',
                    'tag': 'Tag',
                    'follow': 'Abonné',
                    'following': 'Abonnement',
                    'unfollow': 'Se désabonné'
                },
                'topPosters': {
                    'title': 'Top Posters',
                    'username': 'Username',
                    'count': 'Combien de Statuts'
                }
            },

            'form': {
                'cancel': 'Annuler',
                'save': 'Sauvegarder',
                'success': 'Le formulaire a été enregistré avec succès.',
                'fail': 'Impossible de sauvegarder le formulaire.',
                'deleted': 'Votre fichier a été supprimé.'
            },

            'admin': {
                'title': 'Dashboard d\'administration',
                'registered': 'Entreprises enregistrées',
                'domain': 'Domaine',
                'count': '# d\'utilisateur(s)',
                'environment': 'Variables d\'environnement (de tatami.properties)',
                'propery': 'Property',
                'value': 'Valeur',
                'reindex': 'Ré-indexation du moteur de recherche',
                'confirm': 'Êtes-vous sûr que vous voulez ré-indexer les moteurs de recherche?',
                'success': 'La ré-indexation du moteur de recherche a réussi.',
                'deactivate': 'Désactiver',
                'activate': 'Activer'
            }
        }
    });

    $translateProvider.useCookieStorage();
    $translateProvider.registerAvailableLanguageKeys(['en', 'fr']);
    $translateProvider.fallbackLanguage('en');
    $translateProvider.determinePreferredLanguage();
}]);;TatamiApp.filter('markdown', ['$sce', function($sce) {
    return function(content) {
        return content ? $sce.trustAsHtml(marked(content)) : '';
    };
}]);;TatamiApp.filter('emoticon', function() {
    return function(content) {
        if(content == null) {
            return content;
        }

        var emoticons = {
            '>:(': '/assets/img/emoticons/angry.png',
            ':$': '/assets/img/emoticons/blushing.png',
            '8)': '/assets/img/emoticons/cool.png',
            'B)': '/assets/img/emoticons/cool.png',
            ":'(": '/assets/img/emoticons/crying.png',
            ':(': '/assets/img/emoticons/frowning.png',
            ':o': '/assets/img/emoticons/gasping.png',
            ':O': '/assets/img/emoticons/gasping.png',
            ':D': '/assets/img/emoticons/grinning.png',
            '<3': '/assets/img/emoticons/heart.png',
            'XD': '/assets/img/emoticons/laughing.png',
            ':x': '/assets/img/emoticons/lips_sealed.png',
            ':X': '/assets/img/emoticons/lips_sealed.png',
            ':#': '/assets/img/emoticons/lips_sealed.png',
            '>:D': '/assets/img/emoticons/malicious.png',
            ':3': '/assets/img/emoticons/naww.png',
            ':)': '/assets/img/emoticons/smiling.png',
            ':|': '/assets/img/emoticons/speechless.png',
            '>:)': '/assets/img/emoticons/spiteful.png',
            'o_O': '/assets/img/emoticons/surprised.png',
            'D:': '/assets/img/emoticons/terrified.png',
            ':-1:': '/assets/img/emoticons/thumbs_down.png',
            ':+1:': '/assets/img/emoticons/thumbs_up.png',
            'XP': '/assets/img/emoticons/tongue_out_laughing.png',
            ':p': '/assets/img/emoticons/tongue_out.png',
            ':P': '/assets/img/emoticons/tongue_out.png',
            ':/': '/assets/img/emoticons/unsure.png',
            ';)': '/assets/img/emoticons/winking_grinning.png',
            ';p': '/assets/img/emoticons/winking_tongue_out.png',
            ';P': '/assets/img/emoticons/winking_tongue_out.png',
            ':t': '/assets/img/emoticons/trollface.png'
        };

        function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        }

        for(var key in emoticons) {
            var reg = new RegExp('(^| )' + escapeRegExp(key) + '($| )');
            content = content.replace(reg, ' ![' + key + '](' + emoticons[key] + ') ');
        }

        return content;
    };
});;TatamiApp.filter('placeholderFilter', ['$translate', function($translate) {
    return function(isReply) {
        if(isReply) {
            return "";
        }
        else {
            return $translate.instant('tatami.home.post.update');
        }
    }
}]);;TatamiApp.factory('HomeService', ['$resource', function($resource) {
    var responseTransform = function(statuses, headersGetter) {
        statuses = angular.fromJson(statuses);

        for(var i = 0; i < statuses.length; i++) {
            statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

            if(statuses[i].geoLocalization) {
                var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                statuses[i]['locationURL'] = 
                    'https://www.openstreetmap.org/?mlon='
                    + longitude + '&mlat=' + latitude;
            }
        }

        return statuses;
    };

    return $resource(null, null,
    {
        'getMentions': { 
            method: 'GET', isArray: true, url: '/tatami/rest/mentions',
            transformResponse: responseTransform
        },
        'getFavorites': { 
            method: 'GET', isArray: true, url: '/tatami/rest/favorites',
            transformResponse: responseTransform
        },
        'getCompanyTimeline': { 
            method: 'GET', isArray: true, url: '/tatami/rest/company',
            transformResponse: responseTransform
        }
     });
}]);;TatamiApp.factory('StatusService', ['$resource', function($resource) {
    var responseTransform = function(statuses, headersGetter) {
        statuses = angular.fromJson(statuses);

        for(var i = 0; i < statuses.length; i++) {
            statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

            if(statuses[i].geoLocalization) {
                var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                statuses[i]['locationURL'] = 
                    'https://www.openstreetmap.org/?mlon='
                    + longitude + '&mlat=' + latitude;
            }
        }

        return statuses;
    };

    return $resource('/tatami/rest/statuses/:statusId', null,
    {   
        'get': { 
            method: 'GET',
            transformResponse: function(status, headersGetter) {
                status = angular.fromJson(status);

                status.avatarURL = status.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + status.avatar + '/photo.jpg';
                
                if(status.geoLocalization) {
                    var latitude = status.geoLocalization.split(',')[0].trim();
                    var longitude = status.geoLocalization.split(',')[1].trim();
                    status['locationURL'] = 
                        'https://www.openstreetmap.org/?mlon='
                        + longitude + '&mlat=' + latitude;
                }

                return status;
             }
        },
        'getHomeTimeline': { 
            method: 'GET', isArray: true, url: '/tatami/rest/statuses/home_timeline',
            transformResponse: responseTransform
        },
        'getUserTimeline': { 
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/statuses/:username/timeline',
            transformResponse: responseTransform
        },
        'getDetails': {
            method: 'GET', params: { statusId: '@statusId' }, url: '/tatami/rest/statuses/details/:statusId',
            transformResponse: function(details, headersGetter) {
                details = angular.fromJson(details);

                for(var i = 0; i < details.discussionStatuses.length; i++) {
                    details.discussionStatuses[i]['avatarURL'] = details.discussionStatuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.discussionStatuses[i].avatar + '/photo.jpg';

                    if(details.discussionStatuses[i].geoLocalization) {
                        var latitude = details.discussionStatuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = details.discussionStatuses[i].geoLocalization.split(',')[1].trim();
                        details.discussionStatuses[i]['locationURL'] = 
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                for(var i = 0; i < details.sharedByLogins.length; i++) {
                    details.sharedByLogins[i]['avatarURL'] = details.sharedByLogins[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + details.sharedByLogins[i].avatar + '/photo.jpg';
                }

                return details;
            }
        },
        'update': { method: 'PATCH', params: { statusId: '@statusId' } },
        'announce': { method: 'PATCH', params: { params: '@statusId' } }
    });
}]);;TatamiApp.factory('ProfileService', ['$resource', function($resource) {
    return $resource('/tatami/rest/account/profile', null,
    {
        'get': { 
            method: 'GET',
            transformResponse: function(profile, headersGetter) {
                profile = angular.fromJson(profile);
                profile['avatarURL'] = profile.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + profile.avatar + '/photo.jpg';
                return profile;
            }
        },
        'update' : { 
            method: 'PUT',
            transformRequest: function(profile, headersGetter) {
                delete profile['avatarURL'];
                return angular.toJson(profile);
            }
        }
    });
}]);;TatamiApp.factory('UserService', ['$resource', function($resource) {
    var responseTransform = function(users, headersGetter) {
        users = angular.fromJson(users);

        for(var i = 0; i < users.length; i++) {
            users[i]['avatarURL'] = users[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
        }

        return users;
    };

    return $resource('/tatami/rest/users/:username', null,
    { 
        'get': { 
            method: 'GET', params: { username: '@username' },
            transformResponse: function(user, headersGetter) {
                user = angular.fromJson(user);
                user['avatarURL'] = user.avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            }
        },
        'query': { 
            method: 'GET', isArray: true, url: '/tatami/rest/users',
            transformResponse: responseTransform
        },
        'getFollowing': { 
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/users/:username/friends',
            transformResponse: responseTransform
        },
        'getFollowers': { 
            method: 'GET', isArray: true, params: { username: '@username' }, url: '/tatami/rest/users/:username/followers',
            transformResponse: responseTransform
        },
        'getSuggestions': { 
            method: 'GET', isArray: true, url: '/tatami/rest/users/suggestions', 
            transformResponse: function(suggestions, headersGetter) {
                suggestions = angular.fromJson(suggestions);

                for(var i = 0; i < suggestions.length; i++) {
                    suggestions[i]['avatarURL'] = suggestions[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + suggestions[i].avatar + '/photo.jpg';
                    suggestions[i]['followingUser'] = false;
                }

                return suggestions;
            }
        },
        'follow': { method: 'PATCH', params: { username: '@username' } },
        'searchUsers': { method: 'GET', isArray: true, url: '/tatami/rest/users/:term', transformResponse: responseTransform },
        'deactivate': { method: 'PATCH', params: { username: '@username' } }
    });
}]);;TatamiApp.factory('GroupService', ['$resource', function($resource) {
    return $resource('/tatami/rest/groups/:groupId', null,
    {
        'getStatuses': { 
            method: 'GET',
            isArray: true,
            params: { groupId: '@groupId' },
            url: '/tatami/rest/groups/:groupId/timeline',
            transformResponse: function(statuses, headersGetter) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

                    if(statuses[i].geoLocalization) {
                        var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                        statuses[i]['locationURL'] = 
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                return statuses;
            }
        },
        'getMembers': { 
            method: 'GET',
            isArray: true,
            params: { groupId: '@groupId' },
            url: '/tatami/rest/groups/:groupId/members/',
            transformResponse: function(users, headersGetter) {
                users = angular.fromJson(users);

                for(var i = 0; i < users.length; i++) {
                    users[i]['avatarURL'] = users[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
                }

                return users;
            }
        },
        'getRecommendations': { method: 'GET', isArray: true, url: '/tatami/rest/groupmemberships/suggestions' },
        'join': { method: 'PUT', params: { groupId: '@groupId', username: '@username' }, url: '/tatami/rest/groups/:groupId/members/:username' },
        'leave': { method: 'DELETE', params: { groupId: '@groupId', username: '@username' }, url: '/tatami/rest/groups/:groupId/members/:username' },
        'update': { method: 'PUT', params: { groupId: '@groupId' }, url: '/tatami/rest/groups/:groupId' }
    });
}]);;TatamiApp.factory('TagService', ['$resource', function($resource) {
    return $resource('/tatami/rest/tags', null,
    {   
        'get': { method:'GET', params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag' },
        'getTagTimeline': { 
            method:'GET', isArray: true, params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag/tag_timeline',
            transformResponse: function(statuses, headersGetter) {
                statuses = angular.fromJson(statuses);

                for(var i = 0; i < statuses.length; i++) {
                    statuses[i]['avatarURL'] = statuses[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + statuses[i].avatar + '/photo.jpg';

                    if(statuses[i].geoLocalization) {
                        var latitude = statuses[i].geoLocalization.split(',')[0].trim();
                        var longitude = statuses[i].geoLocalization.split(',')[1].trim();
                        statuses[i]['locationURL'] = 
                            'https://www.openstreetmap.org/?mlon='
                            + longitude + '&mlat=' + latitude;
                    }
                }

                return statuses;
            }
        },
        'follow': { method:'PUT', params: { tag: '@tag' }, url: '/tatami/rest/tags/:tag' },
        'getPopular': { method: 'GET', isArray: true, url: '/tatami/rest/tags/popular' }
    });
}]);;
TatamiApp.factory('GeolocalisationService', function() {
    return {
        
                getGeolocalisation: function(callback) {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position) {
                    callback(position);
                });
            }
        },

                getGeolocUrl: function(position) {
            var latitude = position.split(',')[0].trim();
            var longitude = position.split(',')[1].trim();
            return 'https://www.openstreetmap.org/?mlon=' + longitude + '&mlat=' + latitude;
        }
    }
});;TatamiApp.factory('SearchService', ['$resource', function($resource) {
    var responseTransform = function(users, headersGetter) {
        users = angular.fromJson(users);

        for(var i = 0; i < users.length; i++) {
            users[i]['avatarURL'] = users[i].avatar=='' ? '/assets/img/default_image_profile.png' : '/tatami/avatar/' + users[i].avatar + '/photo.jpg';
        }

        return users;
    };

    return $resource('/tatami/rest/search/:term', { term: '@term' },
    {
        'query': { 
            method: 'GET', isArray: true, transformResponse: responseTransform
        },
        'get': {
            method: 'GET', transformResponse: responseTransform
        }
    });
}]);;TatamiApp.factory('TopPostersService', ['$resource', function($resource) {
    return $resource('/tatami/rest/stats/day');
}]);;TatamiApp.factory('UserSession', ['$q', '$window', 'ProfileService', 'localStorageService', function($q, $window, ProfileService, localStorageService) {
    var user;
    var authenticated = false;

    return {
        isAuthenticated: function() {
            return localStorageService.get('token') === "true";
        },

        isUserResolved: function() {
            return angular.isDefined(user);
        },

        setLoginState: function(loggedIn) {
            localStorageService.set('token', loggedIn);
        },

        clearSession: function() {
            localStorageService.clearAll();
        },

        getUser: function() {
            return user;
        },

        authenticate: function(force) {
            var deferred = $q.defer();

            if(force) {
                user = undefined;
            }

            if(this.isUserResolved() && user.action !== null) {
                deferred.resolve(user);
                return deferred.promise;
            }

            ProfileService.get(function(data) {
                user = data;
                authenticated = true;
                deferred.resolve(user);
            }, function(data) {
                user = null;
                authenticated = false;
                deferred.resolve(user);
            });

            return deferred.promise;
        }
    }
}]);;TatamiApp.factory('AuthenticationService', ['$rootScope', '$state', 'UserSession', function($rootScope, $state, UserSession) {
    return {
        authenticate: function() {
            return UserSession.authenticate().then(function(result) {
                if(result !== null && result.action === null && $state.current.data && !$state.current.data.public) {
                    UserSession.clearSession();
                    $state.go('tatami.login.main');
                }
            });
        }
    }
}]);;TopMenuModule.controller('TopMenuController', [
    '$scope',
    '$window',
    '$http',
    '$translate',
    'UserSession',
    'SearchService',
    function($scope, $window, $http, $translate, UserSession, SearchService) {
        $scope.current = {};
        $scope.current.searchString = '';

        $scope.$on('start-tour', function() {
            $scope.tour.restart(true);
        });

        $scope.changeLanguage = function(key) {
            $translate.use(key);
        };

        $scope.openPostModal = function() {
            $scope.$state.go($scope.$state.current.name + '.post');
        };

        $scope.logout = function() {
            $http.get('/tatami/logout')
                .success(function() {
                    UserSession.clearSession();
                    $scope.$state.go('tatami.login.main');
                    $scope.searchString = '';
                });
        };
        $scope.goToBlog = function() {
            var lang = $translate.use();
            if(lang != 'fr' && lang != 'en')
                lang = $translate.proposedLanguage();
           switch(lang) {
               case 'fr':
                   window.open("http://blog.ippon.fr/");
                   break;
               default:
                   window.open('http://www.ipponusa.com/blog/');
                   break;
           }
        };

        $scope.getResults = function(searchString) {
            return SearchService.get({ term: 'all', q: searchString }).$promise.then(function(result) {
                if(angular.isDefined(result.groups[0])) {
                    result.groups[0].firstGroup = true;
                }
                if(angular.isDefined(result.tags[0])) {
                    result.tags[0].firstTag = true;
                }
                if(angular.isDefined(result.users[0])) {
                    result.users[0].firstUser = true;
                }
                return result.groups.concat(result.users.concat(result.tags));
            })
        };

        $scope.changeInput = function(param) {
            $scope.searchString = param;
        };

        $scope.searchStatuses = function(e) {
            if(e.keyCode === 13) {
                $scope.$state.go('tatami.home.search', { searchTerm: $scope.searchString });
            }
        };

        $scope.goToPage = function($item, $model, $label) {
            if($item.groupId) {
                $scope.$state.go('tatami.home.home.group.statuses', { groupId: $item.groupId });
            }
            else if($item.login) {
                $scope.$state.go('tatami.home.profile.statuses', { username: $item.username });
            }
            else if(!$item.groupId) {
                $scope.$state.go('tatami.home.home.tag', { tag: $item.name })
            }
        };
}]);