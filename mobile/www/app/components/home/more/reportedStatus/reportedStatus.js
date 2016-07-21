/**
 * Created by emilyklein on 7/11/16.
 */
(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('reportedStatus', {
                cache: false,
                url: '/reportedStatus',
                parent: 'more',
                views: {
                    'more@home': {
                        templateUrl: 'app/components/home/more/reportedStatus/reportedStatus.html',
                        controller: 'ReportedStatusController',
                        controllerAs: 'vm'
                    }
                }
            });
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('reportedStatus', 'home');
        TatamiState.addConversationState('reportedStatus', 'home');
        TatamiState.addTagState('reportedStatus', 'home');
    }

})();
