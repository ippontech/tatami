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
            templateUrl: 'app/shared/user/users.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', '$state', 'UserService'];
    function controller($scope, $state, UserService) {
        var vm = this;

        vm.user = $scope.user;
        vm.followUser = followUser;
        function followUser() {
            UserService.follow({ username : vm.user.username }, { friend: !vm.user.friend, friendShip: true },
                function() {
                    $state.reload();
                });
        }

    }
})();
