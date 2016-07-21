/**
 * Created by emilyklein on 7/11/16.
 */
(function() {
    'use strict';

    angular.module('tatami')
        .controller('ReportedStatusController', reportedStatusController);

    reportedStatusController.$inject = ['$state', 'currentUser', 'ReportService', '$ionicPopup', 'ionicToast', '$translate'];
    function reportedStatusController($state, currentUser, ReportService, $ionicPopup, ionicToast, $translate) {
        var vm = this;

        vm.reportedStatuses = [];
        vm.currentUser = currentUser;

        vm.getReportedStatuses = getReportedStatuses;
        vm.hasReportedStatus = hasReportedStatus;
        vm.approveStatus = approveStatus;
        vm.deleteStatus = deleteStatus;

        function reportStatus() {
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
            ReportService.getReportedStatuses(null, function(response){
                    console.log(response);
                    vm.reportedStatuses = response;
                }
            );
        }

        function deleteStatus(statusId){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Status',
                template: '<span translate="status.reportStatus.delete"></span>'
            });
            confirmPopup.then(deleted);
            deleted.$inject = ['decision'];
            function deleted(decision) {
                if(decision) {
                    ReportService.deleteStatus({statusId: statusId}, function () {
                            $translate('status.reportStatus.deleteToast').then(function(msg){
                                if (ionic.Platform.isIOS()){
                                    console.log("does toast work?");
                                    ionicToast.show(msg, 'top', false, 2000);

                                }
                                else{
                                    ionicToast.show(msg, 'bottom', false, 2000);
                                }
                            });
                        }
                    );
                    $state.go($state.current, {}, {reload: true});
                }
            }
        }

        function approveStatus(statusId){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Approve Status',
                template: '<span translate="status.reportStatus.approve"></span>'
            });
            confirmPopup.then(approved);
            approved.$inject = ['decision'];
            function approved(decision) {
                if(decision) {
                    ReportService.approveStatus({statusId: statusId}, function () {
                            $translate('status.reportStatus.approveToast').then(function(msg){
                                if (ionic.Platform.isIOS()){
                                    console.log("should show toast");
                                    ionicToast.show(msg, 'top', false, 2000);
                                }
                                else{
                                    ionicToast.show(msg, 'bottom', false, 2000);
                                }
                            });
                        }
                    );
                    $state.go($state.current, {}, {reload: true});
                }
            }
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
