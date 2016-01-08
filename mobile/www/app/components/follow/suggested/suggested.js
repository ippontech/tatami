angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('follow.suggested', {
                url: '/suggested',
                views: {
                    'follow-suggested': {
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
