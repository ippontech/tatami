var HomeModule = angular.module('HomeModule', [
    'HomeSidebarModule',
    'ProfileSidebarModule',
    'ngSanitize',
    'angularMoment',
    'infinite-scroll'
]);

var minutes = .1;
HomeModule.run(['localStorageService','$rootScope','$location','$interval','$state','$document',function(localStorageService, $rootScope, $location, $interval, $state, $document) {
    var time = Date.now();
    $interval(function() {
        //if the user is logged in, not at the login page, and inactive...
        if (Date.now()-time > (minutes*60000) && !$state.is('tatami.login.main') && localStorageService.get('token') === "true")  {
            localStorageService.clearAll();
            $state.go('tatami.login.main');
            alert('User logged out due to inactivity.');
        }
    }, 1000);
    //tracking basically all user input.
    $document.on('keydown DOMMouseScroll mousewheel mousedown touchstart',
    function resetIdle () {
        time=Date.now();
    });

}]);

HomeModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.home', {
            url: '/home',
            abstract: true,
            templateUrl: 'app/components/home/HomeView.min.html',
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
                    templateUrl: 'app/components/home/status/StatusView.min.html',
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
                    templateUrl: 'app/components/home/search/SearchHeaderView.min.html',
                    controller: 'SearchHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.min.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                $modal.open({
                    templateUrl: 'app/components/home/welcome/WelcomeView.min.html',
                    controller: 'WelcomeController'
                });
            }]
        })
        .state('tatami.home.home.mentions', {
            url: '/mentions',
            views: {
                'homeSide@tatami.home': {
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.min.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.min.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/timeline/TimelineHeaderView.min.html'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/tag/TagHeaderView.min.html',
                    controller: 'TagHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.min.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/home/HomeSidebarView.min.html',
                    controller: 'HomeSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/group/GroupHeaderView.min.html',
                    controller: 'GroupHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.min.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.min.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/status/withoutContext/StatusListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.min.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.min.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.min.html',
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
                    templateUrl: 'app/shared/sidebars/profile/ProfileSidebarView.min.html',
                    controller: 'ProfileSidebarController'
                },
                'homeBodyHeader@tatami.home': {
                    templateUrl: 'app/components/home/profile/ProfileHeaderView.min.html',
                    controller: 'ProfileHeaderController'
                },
                'homeBodyContent@tatami.home': {
                    templateUrl: 'app/shared/lists/user/UserListView.min.html',
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