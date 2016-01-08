angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.following', {
                url: '/following',
                views: {
                    'follow-following': {
                        templateUrl: 'app/components/follow/following/following.html',
                        controller: 'FollowingCtrl'
                    }
                },
                resolve: {
                    following: ['UserService', 'currentUser', function(UserService, currentUser) {
                        return UserService.getFollowing({ username: currentUser.username }).$promise;
                    }]
                }
            });
    }
);
