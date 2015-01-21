var LoginModule = angular.module('LoginModule', ['ui.router']);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.login', {
            url: '',
            abstract: true,
            templateUrl: 'app/components/login/LoginView.html'
        })
        .state('tatami.login.manual',{
            url: '/login',
            views: {
                'manualLogin': {
                    templateUrl: '/app/components/login/ManualLoginView.html'
                },
                'googleLogin': {
                    templateUrl: '/app/components/login/googlelogin/GoogleLoginView.html'
                },
                'register': {
                    templateUrl: '/app/components/login/register/RegisterView.html'
                }
            }
        });
}]);