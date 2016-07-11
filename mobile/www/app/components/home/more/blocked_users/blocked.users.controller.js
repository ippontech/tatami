(function() {
    'use strict';

    angular.module('tatami')
        .controller('BlockedUsersController', blockedUsersController);

    blockedUsersController.$inject = ['currentUser', 'BlockService'];
    function blockedUsersController(currentUser, BlockService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.blockedUsers = [];

        vm.updateUser = updateUser;
        vm.getBlockedUsersForUser = getBlockedUsersForUser;
        vm.hasBlockedUsers = hasBlockedUsers;

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
