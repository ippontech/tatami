var LoginModule = angular.module('LoginModule', []);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('tatami.login', {
            url: '',
            abstract: true,
            templateUrl: 'app/components/login/LoginView.min.html'
        })
        .state('tatami.login.main', {
            url: '/login?action',
            views: {
                'manualLogin': {
                    templateUrl: '/app/components/login/manual/ManualLoginView.min.html',
                    controller: 'ManualLoginController'
                },
                'recoverPassword': {
                    templateUrl: '/app/components/login/recoverPassword/RecoverPasswordView.min.html',
                    controller: 'RecoverPasswordController'
                },
                'googleLogin': {
                    templateUrl: '/app/components/login/google/GoogleLoginView.min.html',
                    controller: 'GoogleLoginController'
                },
                'register': {
                    templateUrl: '/app/components/login/register/RegisterView.min.html',
                    controller: 'RegisterController'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.registration', {
            url: '/register?key',
            templateUrl: '/app/components/login/email/EmailRegistration.min.html',
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