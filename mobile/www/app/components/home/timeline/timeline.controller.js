(function() {
    'use strict';

    angular.module('tatami')
        .controller('TimelineCtrl', timelineCtrl);

    timelineCtrl.$inject = ['statuses'];
    function timelineCtrl(statuses) {
        var vm = this;

        vm.statuses = statuses;
        vm.getNewStatuses = getNewStatuses;

        function getNewStatuses() {
            
        }
    }
})();
