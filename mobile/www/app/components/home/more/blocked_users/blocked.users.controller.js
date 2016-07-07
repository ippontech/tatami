(function() {
    'use strict';

    angular.module('tatami')
        .controller('BlockedUsersController', blockedUsersController);

    blockedUsersController.$inject = ['currentUser', 'BlockService'];
    function blockedUsersController(currentUser, BlockService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.blockedUsers = null;

        vm.updateUser = updateUser;
        vm.getBlockedUsersForUser = getBlockedUsersForUser;
        vm.hasBlockedUsers = hasBlockedUsers;

        console.log(getBlockedUsersForUser());


        function updateUser() {
            BlockService.updateBlockedUser(
                {username: vm.status.username}
            );
        }

        function getBlockedUsersForUser() {
            BlockService.updateBlockedUser(
                {username: vm.currentUser.username},
                function (result) {
                    vm.blockedUsers = result;
                }
            );
        }
        
        function  hasBlockedUsers() {
            return vm.blockedUsers!=null;
        }
    }
})();
