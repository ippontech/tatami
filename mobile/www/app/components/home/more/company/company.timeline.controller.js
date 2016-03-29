(function() {
    'use strict';

    angular.module('tatami')
        .controller('CompanyTimelineCtrl', companyTimelineCtrl);

    companyTimelineCtrl.$inject = ['statuses', 'currentUser', 'TatamiStatusRefresherService'];
    function companyTimelineCtrl(statuses, currentUser, TatamiStatusRefresherService) {
        var vm = this;
        vm.statuses = statuses;
        vm.currentUser = currentUser;

        vm.getNewStatuses = getNewStatuses;
        vm.getOldStatuses = getOldStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshCompanyTimeline();
        }

        getOldStatuses.$inject = ['finalStatus'];
        function getOldStatuses(finalStatus) {
            return TatamiStatusRefresherService.getOldFromCompanyTimeline(finalStatus);
        }
    }
})();
