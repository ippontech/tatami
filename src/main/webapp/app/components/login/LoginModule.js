var LoginModule = angular.module('LoginModule', ['ui.router']);

LoginModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('login',{
            url: '/login',
            templateUrl: 'app/components/login/LoginView.html'
        });
}]);