angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.suggested', {
                url: '/suggested',
                views: {
                    'follow-suggested': {
                        templateUrl: 'app/components/follow/suggested/suggested.html'
                    }
                }
            });
    }
);
