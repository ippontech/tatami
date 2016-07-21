(function() {
    'use strict';

    angular.module('tatami')
        .controller('ReportedStatusController', reportedStatusController);

    reportedStatusController.$inject = ['currentUser', 'ReportService'];
    function reportedStatusController(currentUser, ReportService) {
        var vm = this;

        vm.reportedStatuses = [];

        vm.currentUser = currentUser;

        vm.getReportedStatuses = getReportedStatuses;
        vm.hasReportedStatus = hasReportedStatus;
        vm.approveStatus = approveStatus;
        vm.deleteStatus = deleteStatus;

        goToProfile.$inject = ['username'];
        function goToProfile(username) {
            var destinationState = $state.current.name.split('.')[0] + '.profile';
            $state.go(destinationState, { username : username });
        }

        function getReportedStatuses(){
            ReportService.getReportedStatuses(null, function(response){
                    console.log(response);
                    vm.reportedStatuses = response;
                }
            );
        }

        function deleteStatus(statusId) {
            ReportService.deleteStatus({statusId: statusId});
        }

        function approveStatus(statusId){
            ReportService.approveStatus({statusId: statusId})
        }

        remove.$inject = ['status'];
        function remove(status) {
            vm.statuses.splice(vm.statuses.indexOf(status), 1);
        }

        function  hasReportedStatus() {
            return vm.reportedStatuses.length > 0
        }
    }
})();
