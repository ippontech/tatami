(function() {
    'use strict';

    angular.module('tatami')
        .controller('TimelineDetailCtrl', timelineDetailCtrl);

    timelineDetailCtrl.$inject = ['status'];
    function timelineDetailCtrl(status) {
        var vm = this;

        vm.status = status;
    }
})();
