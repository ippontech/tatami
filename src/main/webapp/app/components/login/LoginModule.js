var LoginModule = angular.module('LoginModule', ['ui.router']);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.login', {
            url: '',
            abstract: true,
            data: {
                loginState: false
            },
            templateUrl: 'app/components/login/LoginView.html'
        })
        .state('tatami.login.main',{
            url: '/login',
            views: {
                'manualLogin': {
                    templateUrl: '/app/components/login/ManualLoginView.html',
                    controller: 'ManualLoginController'
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