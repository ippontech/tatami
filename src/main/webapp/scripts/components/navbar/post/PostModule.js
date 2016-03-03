var PostModule = angular.module('PostModule', ['ngFileUpload', 'ui.router']);

PostModule.config(['$stateProvider', function($stateProvider) {
    var onEnterArray = ['$stateParams', '$uibModal', function($stateParams, $uibModal) {
        $uibModal.open({
            templateUrl: '/scripts/components/navbar/post/PostView.html',
            controller: 'PostController',
            backdrop: 'static',
            animation: true,
            keyboard: true,
            resolve: {
                curStatus: ['StatusService', function(StatusService) {
                    if($stateParams.statusId !== null) {
                        return StatusService.get({ statusId: $stateParams.statusId }).$promise;
                    }
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('post');
                    $translatePartialLoader.addPart('form');
                    $translatePartialLoader.addPart('status');
                    return $translate.refresh();
                }]
            }
        });
    }];

    var onEnterArrayStatusView = ['$stateParams', '$uibModal', function($stateParams, $uibModal) {
       $uibModal.open({
            templateUrl: '/scripts/components/navbar/post/PostView.html',
            controller: 'PostController',
            backdrop: 'static',
            keyboard: true,
            animation: true,
            resolve: {
                curStatus: ['StatusService', function(StatusService) {
                    if($stateParams.statusIdReply !== null) {
                        return StatusService.get({ statusId: $stateParams.statusIdReply }).$promise;
                    }
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('post');
                    $translatePartialLoader.addPart('form');
                    $translatePartialLoader.addPart('status');
                    return $translate.refresh();
                }]
            }
        });
    }];

    $stateProvider
        .state('home.post', {
            url: '',
            params: {
                'statusIdReply': null
            },
            onEnter: onEnterArrayStatusView
        })
        .state('home.status.post', {
            url: '',
            params: {
                'statusIdReply': null
            },
            onEnter: onEnterArrayStatusView
        })
        .state('home.search.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.timeline.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.mentions.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.favorites.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.company.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.tag.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.group.statuses.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.home.group.members.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.profile.statuses.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.profile.following.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        })
        .state('home.profile.followers.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: onEnterArray
        });
    }
]);
