var HomeModule = angular.module('HomeModule', [
    'HomeSidebarModule',
    'ProfileSidebarModule',
    'ngSanitize',
    'angularMoment',
    'infinite-scroll',
    'ui.router',
    'ui.bootstrap'
]);

HomeModule.config(['$stateProvider', function($stateProvider) {
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
                    return StatusService.getContext({ statusId: $stateParams.statusId }).$promise;
                }]
            }
        })
        //state for all views that use home sidebar
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
                showModal: function () {
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
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html',
                    controller: 'TimelineHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['StatusService', function(StatusService) {
                    return StatusService.getHomeTimeline().$promise;
                }],
                // Is it possible to move this logic to a controller?
                // This logic will be redone too
                context: ['statuses', 'StatusService', '$q', function(statuses, StatusService, $q) {
                    var temp = [];
                    for(var i = 0; i < statuses.length; ++i) {
                        if(statuses[i].replyTo) {
                            temp.push(StatusService.get({ statusId: statuses[i].replyTo })
                                .$promise.then(
                                    function(response) {
                                        if(angular.equals({}, response.toJSON())) {
                                            return $q.when(null);
                                        }
                                    return response;
                            }));
                        }
                        else {
                            temp.push(null);
                        }
                    }
                    return $q.all(temp);
                }],
                statusesWithContext: ['statuses', 'context', function(statuses, context) {
                    for(var i = 0; i < statuses.length; ++i) {
                        statuses[i]['context'] = context[i];
                    }
                    return statuses;
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
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
                    controller: 'StatusListController'
                }
            },
            resolve: {
                statuses: ['HomeService', function(HomeService) {
                    return HomeService.getMentions().$promise;
                }],

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
        //state for all views that use profile sidebar
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
                    templateUrl: 'app/shared/lists/status/StatusListView.html',
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
]);