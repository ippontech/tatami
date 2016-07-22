(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('allusers', {
                url: '/allusers',
                parent: 'more',
                views: {
                    'more@home': {
                        templateUrl: 'app/components/home/more/all_users/all.users.html',
                        controller: 'AllUsersController',
                        controllerAs: 'vm'
                    }
                }
            });
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('allusers', 'home');
        TatamiState.addConversationState('allusers', 'home');
        TatamiState.addTagState('allusers', 'home');
    }

})();
