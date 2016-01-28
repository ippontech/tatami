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
                        templateUrl: 'app/components/home/mentions/tab-mentions.html',
                        controller: 'MentionsCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mentioned: mentioned
                }
            })
            .state('mention-detail', {
                url: '/mentions/:mentionId',
                parent: 'home',
                views: {
                    'mentions': {
                        templateUrl: 'app/components/home/mentions/mentions-detail.html',
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

