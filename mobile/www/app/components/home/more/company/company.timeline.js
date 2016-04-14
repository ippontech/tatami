(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {

        $stateProvider
            .state('company', {
                url: '/company/timeline',
                parent: 'more',
                views: {
                    'more@home': {
                        templateUrl: 'app/components/home/more/company/company-timeline.html',
                        controller: 'CompanyTimelineCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    statuses: getStatuses
                }
            });

        getStatuses.$inject = ['HomeService'];
        function getStatuses(HomeService) {
            return HomeService.getCompanyTimeline().$promise;
        }
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('company', 'home');
        TatamiState.addConversationState('company', 'home');
        TatamiState.addTagState('company', 'home');
    }

})();
