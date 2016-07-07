(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('settings', {
                url: '/settings',
                parent: 'more',
                views: {
                    'more@home': {
                        templateUrl: 'app/components/home/more/settings/settings.html',
                        controller: 'SettingsController',
                        controllerAs: 'vm'
                    }
                }
            });
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('settings', 'home');
        TatamiState.addConversationState('settings', 'home');
        TatamiState.addTagState('settings', 'home');
    }

})();
