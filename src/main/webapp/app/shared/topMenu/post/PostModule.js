var PostModule = angular.module('PostModule', ['angularFileUpload', 'ui.router']);

PostModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.home.home.timeline.post', {
            url: '',
            params: {
                'statusId': null
            },
            onEnter: ['$stateParams', '$modal', function($stateParams, $modal) {
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
            }]
        })
        .state('tatami.home.status.post', {
            url: '',
            params: {
                'statusIdReply': null
            },
            onEnter: ['$stateParams', '$modal', function($stateParams, $modal) {
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
            }]
        });
    }
]);