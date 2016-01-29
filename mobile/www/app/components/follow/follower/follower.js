angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follower', {
                url: '/follower',
                parent: 'follow',
                views: {
                    'follower': {
                        templateUrl: 'app/components/follow/follower/follower.html',
                        controller: 'FollowerCtrl'
                    }
                },
                resolve: {
                    followers: ['UserService', 'currentUser', function(UserService, currentUser) {
                        return UserService.getFollowers({ username: currentUser.username }).$promise;
                    }]
                }
            });
    }
);
