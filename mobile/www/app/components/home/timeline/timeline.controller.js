(function() {
    'use strict';

    angular.module('tatami')
        .controller('TimelineCtrl', timelineCtrl);

    timelineCtrl.$inject = ['statuses', 'TatamiStatusRefresherService'];
    function timelineCtrl(statuses, TatamiStatusRefresherService) {
        var vm = this;

        vm.statuses = statuses;
        vm.getNewStatuses = getNewStatuses;

        function getNewStatuses() {
            TatamiStatusRefresherService.refreshHomeTimeline().then(setStatuses);
        }

        setStatuses.$inject = ['statuses'];
        function setStatuses(statuses) {
            vm.statuses = statuses;
        }
    }
})();
