(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$http', '$state', 'PathService'];
    function moreController($http, $state, PathService) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            $http.get(PathService.buildPath('/tatami/logout')).then(goToLogin)
        }

        function goToLogin() {
            $state.go('login');
        }
    }
})();
