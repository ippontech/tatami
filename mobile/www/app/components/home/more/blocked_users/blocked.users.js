(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('blockedusers', {
                url: '/blockedusers',
                parent: 'more',
                views: {
                    'more@home': {
                        templateUrl: 'app/components/home/more/blocked_users/blocked.users.html',
                        controller: 'BlockedUsersController',
                        controllerAs: 'vm'
                    }
                }
            });
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('blockedusers', 'home');
        TatamiState.addConversationState('blockedusers', 'home');
        TatamiState.addTagState('blockedusers', 'home');
    }

})();
