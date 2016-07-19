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

        vm.getReportedStatuses = getReportedStatuses;
        vm.hasReportedStatus = hasReportedStatus;

        // console.log('hasReportedStatuses=' + vm.hasReportedStatus());

        function reportStatus() {
            ReportService.reportStatus({statusId: vm.status.statusId});
            $ionicPopup.alert({
                title: 'Report',
                template: '<span translate="status.reportMessage"></span>'
            });
        }

        function getReportedStatuses(){
            ReportService.getReportedStatuses(
                function(response){
                    vm.reportedStatuses = response;
                }
            );
        }

        //TODO: function for approved statuses
        function deleteStatus(statusId){
            ReportService.deleteReported({statusId: vm.status.statusId})
        }

        function approveStatus(statusId){
            ReportService.approve({statusId: vm.status.statusId})
        }

        function  hasReportedStatus() {
            return vm.reportedStatuses.length>0;
        }
    }
})();
