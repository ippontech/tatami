(function() {
    'use strict';

    angular.module('tatami')
        .controller('AllUsersController', allUsersController);

    allUsersController.$inject = ['currentUser', 'TatamiUserRefresherService'];
    function allUsersController(currentUser, TatamiUserRefresherService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.users = [];
        vm.isFinished = false;

        vm.getNextUsers = getNextUsers;

        function getNextUsers() {
            return TatamiUserRefresherService.getNextUsers(vm.users.length).then(addUsers);
        }

        addUsers.$inject = ['users'];
        function addUsers(nextUsers) {
            vm.users.push.apply(vm.users, nextUsers);
            vm.isFinished = nextUsers.length === 0;
        }
    }
})();
