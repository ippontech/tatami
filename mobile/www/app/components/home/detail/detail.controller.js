(function() {
    'use strict';

    angular.module('tatami')
        .controller('DetailCtrl', detailCtrl);

    detailCtrl.$inject = ['status'];
    function detailCtrl(status) {
        var vm = this;

        vm.status = status;
    }
})();
