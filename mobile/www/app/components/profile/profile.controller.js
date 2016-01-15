(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['user'];
    function profileCtrl(user) {
        var vm = this;
        vm.user = user;
    }
})();
