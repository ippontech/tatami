angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.following', {
                url: '/following',
                views: {
                    'follow-following': {
                        templateUrl: 'app/components/follow/following/following.html'
                    }
                }
            });
    }
);
