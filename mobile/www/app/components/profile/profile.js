angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/components/profile/profile.html',
                controller: 'ProfileCtrl',
                views: {

                }
            });
    }
);
