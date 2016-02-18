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

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshHomeTimeline();
        }
    }
})();
