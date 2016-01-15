(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiUser', tatamiUser);

    tatamiUser.$inject = ['$state'];
    function tatamiUser($state) {
        var directive = {
            restrict: 'E',
            scope: {
                user: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/user/user.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', 'UserService'];
    function controller($scope, UserService) {
        var vm = this;

        vm.user = $scope.user;
        vm.followUser = followUser;
        function followUser() {
            UserService.follow({ username : vm.user.username }, { friend: !vm.user.friend, friendShip: true },
                function() {
                    vm.user.friend = !vm.user.friend;
                });
        }

    }
})();
