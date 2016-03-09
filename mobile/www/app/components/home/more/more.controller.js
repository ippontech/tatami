(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$state', '$localStorage', '$ionicHistory'];
    function moreController($state, $localStorage, $ionicHistory) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            $localStorage.clear();
            $ionicHistory.clearCache();
            $state.go('login');
        }
    }
})();
