angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow', {
                url: '',
                templateUrl: 'app/components/follow/follow-tabs.html'
            });
    }
);
