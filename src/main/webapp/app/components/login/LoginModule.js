var LoginModule = angular.module('LoginModule', ['ui.router']);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.login', {
            url: '',
            abstract: true,
            templateUrl: 'app/components/login/LoginView.html'
        })
        .state('tatami.login.main', {
            url: '/login?action',
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
            },
            data: {
                public: true
            }
        })
        .state('tatami.registration', {
            url: '/register?key',
            templateUrl: '/app/components/login/email/EmailRegistration.html',
            controller: 'EmailRegistrationController',
            resolve: {
                update: ['RegistrationService', '$stateParams', function(RegistrationService, $stateParams) {
                    return RegistrationService.getUpdate({ register: 'register', key: $stateParams.key }).$promise;
                }]
            },
            data: {
                public: true
            }
        });
}]);