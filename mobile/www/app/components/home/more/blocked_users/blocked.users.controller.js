(function() {
    'use strict';

    angular.module('tatami')
        .controller('BlockedUsersController', blockedUsersController);

    blockedUsersController.$inject = ['$scope', 'currentUser', 'BlockService'];
    function blockedUsersController($scope, currentUser, BlockService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.blockedUsers = [];

        vm.updateUser = updateUser;
        vm.getBlockedUsersForUser = getBlockedUsersForUser;
        vm.hasBlockedUsers = hasBlockedUsers;

        function getBlockedUsersForUser() {
            BlockService.getBlockedUsersForUser(
                {username: vm.currentUser.username},
                function (response) {
                    vm.blockedUsers = response;
                }
            );
            $scope.$broadcast('scroll.refreshComplete');
        }

        function  hasBlockedUsers() {
            return vm.blockedUsers.length>0;
        }
    }
})();
