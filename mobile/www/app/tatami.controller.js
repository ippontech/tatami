(function() {
    'use strict';

    angular.module('tatami')
        .controller('TatamiCtrl', tatamiCtrl);

    tatamiCtrl.$inject = ['$state'];
    function tatamiCtrl($state) {
        var vm = this;
        vm.$state = $state;
    }
})();
