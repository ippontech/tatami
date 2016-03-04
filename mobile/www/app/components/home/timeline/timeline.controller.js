(function() {
    'use strict';

    angular.module('tatami')
        .controller('TimelineCtrl', timelineCtrl);

    timelineCtrl.$inject = ['statuses', 'currentUser', 'TatamiStatusRefresherService'];
    function timelineCtrl(statuses, currentUser, TatamiStatusRefresherService) {
        var vm = this;

        vm.statuses = statuses;
        vm.currentUser = currentUser;
        vm.getNewStatuses = getNewStatuses;
        vm.getOldStatuses = getOldStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshHomeTimeline();
        }

        getOldStatuses.$inject = ['finalStatus'];
        function getOldStatuses(finalStatus) {
            return TatamiStatusRefresherService.getOldFromHomeTimeline(finalStatus);
        }
    }
})();
