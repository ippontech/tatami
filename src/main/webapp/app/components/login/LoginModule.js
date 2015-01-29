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
                    templateUrl: '/app/components/login/manual/ManualLoginView.html',
                    controller: 'ManualLoginController'
                },
                'recoverPassword': {
                    templateUrl: '/app/components/login/recoverPassword/RecoverPasswordView.html',
                    controller: 'RecoverPasswordController'
                },
                'googleLogin': {
                    templateUrl: '/app/components/login/google/GoogleLoginView.html',
                    controller: 'GoogleLoginController'
                },
                'register': {
                    templateUrl: '/app/components/login/register/RegisterView.html',
                    controller: 'RegisterController'
                }
            }
        });
}]);