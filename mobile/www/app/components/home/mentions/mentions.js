(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('mentions', {
                url: '/mentions',
                parent: 'home',
                views: {
                    'mentions': {
                        templateUrl: 'app/components/home/mentions/mentions.html',
                        controller: 'MentionsCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mentioned: mentioned
                }
            });
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('mentions', 'home');
        TatamiState.addConversationState('mentions', 'home');
        TatamiState.addTagState('mentions', 'home');
    }

    mentioned.$inject = ['HomeService'];
    function mentioned(HomeService) {
        return HomeService.getMentions().$promise;
    }

})();

