/**
 * Created by emilyklein on 7/11/16.
 */
(function() {
    'use strict';

    angular.module('tatami')
        .controller('ReportedStatusController', reportedStatusController);

    reportedStatusController.$inject = ['$state', '$scope', 'currentUser', 'ReportService', '$ionicPopup', '$translate', 'ToastService'];
    function reportedStatusController($state, $scope, currentUser, ReportService, $ionicPopup, $translate, ToastService) {
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
                    vm.reportedStatuses = response;
                }
            );
            $scope.$broadcast('scroll.refreshComplete');
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
                        ToastService.display('status.reportStatus.deleteToast');
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
                        ToastService.display('status.reportStatus.approveToast');
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


