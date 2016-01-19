(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$http', '$state'];
    function moreController($http, $state) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            $http.get('/tatami/logout').then(goToLogin)
        }

        function goToLogin() {
            $state.go('login');
        }
    }
})();
