(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiUser', tatamiUser);

    tatamiUser.$inject = [];
    function tatamiUser() {
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

    controller.$inject = ['$scope', '$state', 'UserService'];
    function controller($scope, $state, UserService) {
        var vm = this;

        vm.user = $scope.user;
        vm.followUser = followUser;
        vm.goToProfile = goToProfile;

        function followUser() {
            UserService.follow({ username : vm.user.username }, { friend: !vm.user.friend, friendShip: true },
                function() {
                    vm.user.friend = !vm.user.friend;
                });
        }

        function goToProfile(username) {
            var destinationState = $state.current.name.split('.')[0] + '.profile';
            $state.go(destinationState, { username : username });
        }

    }
})();
