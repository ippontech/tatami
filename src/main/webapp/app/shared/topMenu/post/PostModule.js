var PostModule = angular.module('PostModule', ['angularFileUpload', 'ui.router']);

PostModule.config(['$stateProvider', function($stateProvider) {
    var onEnterArray = ['$stateParams', '$modal', function($stateParams, $modal) {
        $modal.open({
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
       $modal.open({
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
]);