(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('tab.mentions', {
                url: '/mentions',
                views: {
                    'tab-mentions': {
                        templateUrl: 'app/components/mentions/tab-mentions.html',
                        controller: 'MentionsCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mentioned: mentioned
                }
            })
            .state('tab.mention-detail', {
                url: '/mentions/:mentionId',
                views: {
                    'tab-mentions': {
                        templateUrl: 'app/components/mentions/mentions-detail.html',
                        controller: 'MentionDetailCtrl'
                    }
                }
            });
    }

    mentioned.$inject = ['HomeService'];
    function mentioned(HomeService) {
        return HomeService.getMentions().$promise;
    }
})();

