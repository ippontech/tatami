var HomeModule = angular.module('HomeModule', [
    'HomeSidebarModule',
    'ProfileSidebarModule',
    'ngSanitize',
    'angularMoment',
    'infinite-scroll',
    'ui.router',
    'ui.bootstrap',
    'emguo.poller'
]);

HomeModule.config(function(pollerConfig) {
    pollerConfig.resetOnStateChange = true;
});

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
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.html',
                    controller: 'TimelineHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withContext/StatusListContextView.html',
                    controller: 'StatusListContextController'
                }
            },
            resolve: {
                statuses: ['StatusService', function(StatusService) {
                    return StatusService.getHomeTimeline().$promise;
                }],
                context: ['statuses', 'StatusService', '$q', function(statuses, StatusService, $q) {
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
                }],
                statusesWithContext: ['statuses', 'context', function(statuses, context) {
                    var statusesWithContext = [];

                    // Fill array with context statuses
                    for(var i = 0; i < context.length; i++) {
                        if(context[i] != null) {
                            statusesWithContext.push({ status: context[i], replies: [] });
                        }
                    }

                    var individualStatuses = [];

                    // Attach replies to corresponding context status
                    for(var i = 0; i < statuses.length; i++) {
                        if(statuses[i].replyTo) {
                            for(var j = 0; j < statusesWithContext.length; j++) {
                                if(statuses[i].replyTo == statusesWithContext[j].status.statusId) {
                                    statusesWithContext[j].replies.unshift(statuses[i]);
                                    break;
                                }

                                // If the context reply doesn't exist, then make the reply an individual status
                                if(j == statusesWithContext.length - 1) {
                                    individualStatuses.push(statuses[i]);
                                    break;
                                }
                            }
                        } else {
                            var addIt = true;
                            for(var j = 0; j < statusesWithContext.length; j++) {
                                // If the status isn't already in the timeline as a
                                // context status, then add it to individualStatuses
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

                    // Put remaining individual statuses (ones that aren't replies) into the timeline
                    for(var i = 0; i < individualStatuses.length; i++) {
                        // If the timeline is empty, put in a status
                        if(statusesWithContext.length == 0) {
                            statusesWithContext.push({ status: individualStatuses[i], replies: null });
                            continue;
                        }

                        for(var j = 0; j <= statusesWithContext.length; j++) {
                            try {
                                // If the status block has replies, we need to check the 
                                // last reply's post date/time, because that is the latest status in the block.
                                // We order the timeline by the latest status in the block.
                                if(statusesWithContext[j].replies != null && statusesWithContext[j].replies.length != 0) {
                                    var index = statusesWithContext[j].replies.length - 1;
                                    if(statusesWithContext[j].replies[index].statusDate < individualStatuses[i].statusDate) {
                                        statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                                        break;
                                    }
                                } else {
                                    // Otherwise compare using the date of the individual status
                                    if(statusesWithContext[j].status.statusDate < individualStatuses[i].statusDate) {
                                        statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                                        break;
                                    }
                                }
                            } catch(err) {
                                // For statuses that are at the end (bottom) of the timeline
                                statusesWithContext.push({ status: individualStatuses[i], replies: null });
                                break;
                            }
                        }
                    }

                    return statusesWithContext;
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
]);