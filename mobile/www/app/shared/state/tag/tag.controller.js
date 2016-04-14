(function() {
    'use strict';

    angular.module('tatami')
        .controller('TagCtrl', tagCtrl);

    tagCtrl.$inject = ['tag', 'statuses', 'currentUser', 'TatamiStatusRefresherService'];
    function tagCtrl(tag, statuses, currentUser, TatamiStatusRefresherService) {
        var vm = this;
        vm.tag = tag;
        vm.statuses = statuses;
        vm.currentUser = currentUser;
        vm.getNewStatuses = getNewStatuses;
        vm.getOldStatuses = getOldStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshTagTimeline(vm.tag);
        }

        getOldStatuses.$inject = ['finalStatus'];
        function getOldStatuses(finalStatus) {
            return TatamiStatusRefresherService.getOldTags(finalStatus, vm.tag)
        }
    }
})();
