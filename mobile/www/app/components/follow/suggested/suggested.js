(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
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

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('suggested', 'follow');
    }
})();
