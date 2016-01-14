(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', ProfileController);

    ProfileController.$inject = ['user'];
    function ProfileController(user) {
        vm = this;
        vm.user = user;
    }
})();
