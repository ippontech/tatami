(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiUser', tatamiUser);

    tatamiUser.$inject = [];
    function tatamiUser() {
        var directive = {
            restrict: 'E',
            scope: {
                user: '=',
                currentUser: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/user/user.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', '$state', 'UserService', 'BlockService', '$ionicPopup', '$ionicListDelegate'];
    function controller($scope, $state, UserService, BlockService, $ionicPopup, $ionicListDelegate) {
        var vm = this;

        vm.currentUser = $scope.currentUser;
        vm.user = $scope.user;
        vm.$state = $state;
        vm.followUser = followUser;
        vm.goToProfile = goToProfile;
        vm.updateBlockUser = updateBlockUser;
        vm.toggleActivateUser = toggleActivateUser;

        function followUser() {
            UserService.follow({ username : vm.user.username }, { friend: !vm.user.friend, friendShip: true },
                function() {
                    vm.user.friend = !vm.user.friend;
                });
        }

        function goToProfile(username) {
            var destinationState = $state.current.name.split('.')[0] + '.profile';
            $state.go(destinationState, { username : username });
            $ionicListDelegate.closeOptionButtons();
        }

        function updateBlockUser() {
            BlockService.updateBlockedUser(
                {username: vm.user.username },
                function () {
                    if(vm.user.blocked){
                        $ionicPopup.alert({
                            template: '<span translate="user.unblock.success"></span>'
                        });
                    } else{
                        $ionicPopup.alert({
                            template: '<span translate="user.block.success"></span>'
                        });
                    }
                    vm.user.blocked = !vm.user.blocked;
                }
            );
            $ionicListDelegate.closeOptionButtons();
        }

        function toggleActivateUser() {
            var confirmPopup;
            if(vm.user.activated){
               confirmPopup = $ionicPopup.confirm({
                    title: 'Deactivate user',
                    template: '<span translate="user.deactivate.confirmation"></span>'
                });
            } else {
                confirmPopup = $ionicPopup.confirm({
                    title: 'Activate user',
                    template: '<span translate="user.reactivate.confirmation"></span>'
                });
            }
            confirmPopup.then(toggle);
            toggle.$inject = ['decision'];
            function toggle(decision) {
                if(decision) {
                    UserService.deactivate({ username : vm.user.username }, {activate: true},
                        function() {
                            vm.user.activated = !vm.user.activated;
                        }
                    );
                }
            }
            $ionicListDelegate.closeOptionButtons();
        }
    }
})();
