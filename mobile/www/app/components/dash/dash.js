angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'app/components/dash/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            }
        );
    }
);