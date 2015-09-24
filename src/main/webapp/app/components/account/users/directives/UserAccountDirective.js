UsersModule.directive('tatamiAccountUser', function() {
    return {
        restrict: 'E',
        controller: 'UsersController',
        scope: {
            user: '=',
            isAdmin: '='
        },
        templateUrl: '/app/components/account/users/directives/UserAccountView.html'
    };

});