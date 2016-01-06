angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab.mentions', {
                url: '/mentions',
                views: {
                    'tab-mentions': {
                        templateUrl: 'app/components/mentions/tab-mentions.html',
                        controller: 'MentionsCtrl'
                    }
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
);
