/**
 * Created by emilyklein on 7/11/16.
 */
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

        // console.log('hasReportedStatuses=' + vm.hasReportedStatus());

        function reportStatus() {
            console.log("reported a status?");
            ReportService.reportStatus({statusId: vm.status.statusId});
            $ionicPopup.alert({
                title: 'Report',
                template: '<span translate="status.reportMessage"></span>'
            });
        }

        goToProfile.$inject = ['username'];
        function goToProfile(username) {
            var destinationState = $state.current.name.split('.')[0] + '.profile';
            $state.go(destinationState, { username : username });
        }

        function getReportedStatuses(){
            console.log("In reported statuses");
            ReportService.getReportedStatuses(null,
                function(response){
                    console.log(response);
                    vm.reportedStatuses = response;
                }
            );
        }

        //TODO: function for approved statuses
        function deleteStatus(statusId){
            console.log("in deleted");
            ReportService.deleteStatus({statusId: statusId})
        }

        function approveStatus(statusId){
            ReportService.approveStatus({statusId: statusId})
        }

        remove.$inject = ['status'];
        function remove(status) {
            vm.statuses.splice(vm.statuses.indexOf(status), 1);
        }

        function  hasReportedStatus() {
            console.log(vm.reportedStatuses.length);

            if (vm.reportedStatuses.length>0){
                return true;
            }
            else
                return false;
        }
    }
})();
