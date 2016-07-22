(function() {
    'use strict';

    angular.module('tatami')
        .controller('AllUsersController', allUsersController);

    allUsersController.$inject = ['$scope', 'currentUser', 'UserService'];
    function allUsersController($scope, currentUser, UserService) {
        var vm = this;
        vm.currentUser = currentUser;
        vm.users = [];

        vm.getAllUsers = getAllUsers;
        
        function getAllUsers() {
            UserService.query(null, function (users) {
                vm.users = users;
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
    }
})();
