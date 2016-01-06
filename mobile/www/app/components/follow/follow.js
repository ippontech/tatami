angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow', {
                url: '/follow',
                templateUrl: 'app/components/follow/follow.html'
            });
    }
);
