(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$http', '$state', '$localStorage', 'PathService'];
    function moreController($http, $state, $localStorage, PathService ) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            $http.get(PathService.buildPath('/tatami/logout')).then(goToLogin)
        }

        function goToLogin() {
            $localStorage.set('token', '');
            $state.go('login');
        }
    }
})();
