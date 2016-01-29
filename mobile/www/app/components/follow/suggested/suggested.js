angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('suggested', {
                url: '/suggested',
                parent: 'follow',
                views: {
                    'suggested': {
                        templateUrl: 'app/components/follow/suggested/suggested.html',
                        controller: 'SuggestedCtrl'
                    }
                },
                resolve: {
                    suggested: ['UserService', function(UserService) {
                        return UserService.getSuggestions().$promise;
                    }]
                }
            });
    }
);
