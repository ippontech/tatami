angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.follower', {
                url: '/follower',
                views: {
                    'follow-follower': {
                        templateUrl: 'app/components/follow/follower/follower.html',
                        controller: 'FollowerCtrl'
                    }
                },
                resolve: {
                    currentUser: ['ProfileService', function(ProfileService) {
                        return ProfileService.get().$promise;
                    }],

                    followers: ['UserService', 'currentUser', function(UserService, currentUser) {
                        console.log(currentUser);
                        return UserService.getFollowers({ username: currentUser.username }).$promise;
                    }]
                }
            });
    }
);
