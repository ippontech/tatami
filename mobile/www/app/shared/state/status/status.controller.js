(function() {
    'use strict';

    angular.module('tatami')
        .controller('StatusCtrl', statusCtrl);

    statusCtrl.$inject = ['status'];
    function statusCtrl(status) {
        var vm = this;

        vm.status = status;
    }
})();
