angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                parent: 'tatami',
                templateUrl: 'app/components/login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            });
    });
