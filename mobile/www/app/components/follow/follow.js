angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow', {
                url: '/follow',
                parent: 'tatami',
                abstract: true,
                templateUrl: 'app/components/follow/follow.html',
                resolve: {
                    currentUser: ['ProfileService', function(ProfileService) {
                        return ProfileService.get().$promise;
                    }]
                }
            });
    }
);
