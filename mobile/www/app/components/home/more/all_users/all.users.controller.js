(function() {
    'use strict';

    angular.module('tatami')
        .controller('AllUsersController', allUsersController);

    allUsersController.$inject = ['currentUser', 'TatamiUserRefresherService', '$scope', '$timeout'];
    function allUsersController(currentUser, TatamiUserRefresherService, $scope, $timeout) {
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
            $timeout(function() {
                $scope.$apply(function() {
                    vm.users.push.apply(vm.users, nextUsers);
                    vm.isFinished = nextUsers.length === 0;
                });
            })
        }
    }
})();
