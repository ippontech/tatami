var AdminModule = angular.module('AdminModule', ['ui.router']);

AdminModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('admin',{
            url: '/admin?message',
            templateUrl: '/app/components/admin/AdminView.html',
            resolve: {
                adminData: ['AdminService', '$state', function(AdminService, $state) {
                    return AdminService.get().$promise.then(function(success) {
                        return success;
                    }, function(err) {
                        if(err.status === 500) {
                            // This print statement is a reminder that this needs to change
                            console.log('redirect to access denied page');
                            $state.go('tatami.home.home.timeline');
                            // Once the error pages exist, redirect to error page
                        }
                    });
                }]
            },
            controller: 'AdminController'
        })
}]);