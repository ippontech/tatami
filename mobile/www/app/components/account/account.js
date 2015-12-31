angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'app/components/account/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });
    });