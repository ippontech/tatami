/**
 * Created by emilyklein on 7/11/16.
 */
(function() {
    'use strict';

    angular.module('tatami')
        .controller('ReportedStatusController', reportedStatusController);

    reportedStatusController.$inject = ['currentUser', 'StatusUpdateService'];
    function reportedStatusController(currentUser, StatusUpdateService) {
        var vm = this;
        // vm.currentUser = currentUser;
        // vm.blockedUsers = [];

        vm.updateUser = updateUser;
        vm.getBlockedUsersForUser = getBlockedUsersForUser;
        vm.hasBlockedUsers = hasBlockedUsers;

        console.log('hasBlockedUsers=' + vm.hasBlockedUsers());

        //this should get all reported statuses for admins
        function getReportedStatuses(){
            StatusUpdateService.getReportedStatus();
            
        }

        function updateUser() {
            BlockService.updateBlockedUser(
                {username: vm.status.username}
            );
        }

        function getBlockedUsersForUser() {
            BlockService.getBlockedUsersForUser(
                {username: vm.currentUser.username},
                function (response) {
                    vm.blockedUsers = response;
                }
            );
        }

        function  hasBlockedUsers() {
            return vm.blockedUsers.length>0;
        }
    }
})();
