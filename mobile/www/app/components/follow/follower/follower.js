angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.follower', {
                url: '/follower',
                views: {
                    'follow-follower': {
                        templateUrl: 'app/components/follow/follower/follower.html'
                    }
                }
            });
    }
);
