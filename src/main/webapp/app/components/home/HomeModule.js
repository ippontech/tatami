var HomeModule = angular.module('HomeModule', [
    'HomeSidebarModule',
    'ProfileSidebarModule',
    'ngSanitize',
    'angularMoment',
    'ui.router'
]);

HomeModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            abstract: true,
            templateUrl: 'app/components/home/HomeView.html',
            resolve: {
                profile: ['ProfileService', function(ProfileService) {
                    return ProfileService.get().$promise;
                }]
            }
        })
        //state for all views that use home sidebar
        .state('home.home', {
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
                }]
            }
        })
        .state('home.home.timeline', {
            url: '/timeline',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', function(StatusService) {
                    return StatusService.getHomeTimeline().$promise;
                }]
            }
        })
        .state('home.home.mentions', {
            url: '/mentions',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getMentions().$promise;
                }]
            }
        })
        .state('home.home.favorites', {
            url: '/favorites',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getFavorites().$promise;
                }]
            }
        })
        .state('home.home.company', {
            url: '/company',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getCompanyTimeline().$promise;
                }]
            }
        })
        .state('home.home.tag', {
            url: '/tag/:tag',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/tag/TagHeaderView.html',
                    controller: 'TagHeaderController'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
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
        .state('home.home.group', {
            url: '/group/:groupId',
            abstract: true,
            resolve: {
                group: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.get({ groupId: $stateParams.groupId }).$promise;
                }]
            }
        })
        .state('home.home.group.statuses', {
            url: '/statuses',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['GroupService', '$stateParams', function(GroupService, $stateParams) {
                    return GroupService.getStatuses({ groupId: $stateParams.groupId }).$promise;
                }]
            }
        })
        .state('home.home.group.members', {
            url: '/members',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@home': {
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
        //state for all views that use profile sidebar
        .state('home.profile', {
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
        .state('home.profile.statuses', {
            url: '/statuses',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', '$stateParams', function(StatusService, $stateParams) {
                    return StatusService.getUserTimeline({ username: $stateParams.username }).$promise;
                }]
            }
        })
        .state('home.profile.following', {
            url: '/following',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@home': {
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
        .state('home.profile.followers', {
            url: '/followers',
            views: {
                'homeSide@home': {
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@home': {
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
]);