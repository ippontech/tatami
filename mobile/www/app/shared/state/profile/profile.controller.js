(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['$ionicPopover', '$ionicPopup', '$scope', '$translate', 'user', 'statuses', 'currentUser', 'TatamiStatusRefresherService', 'UserService', 'BlockService'];
    function profileCtrl($ionicPopover, $ionicPopup, $scope, $translate, user, statuses, currentUser, TatamiStatusRefresherService, UserService, BlockService) {
        var vm = this;
        vm.user = user;
        vm.statuses = statuses;
        vm.currentUser = currentUser;
        vm.isCurrentUser = (vm.currentUser.username === vm.user.username);
        vm.customHeight = (vm.currentUser.isAdmin) ? {'height': '120px'} : {'height': '70px'}; //Adapts the height of the popover depending on the role because a different number of buttons is displayed

        vm.followUser = followUser;
        vm.getNewStatuses = getNewStatuses;
        vm.toggleActivateUser = toggleActivateUser;
        vm.blockUser = blockUser;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshUserTimeline(user).then(setStatuses);
        }

        setStatuses.$inject = ['statuses'];
        function setStatuses(statuses) {
            vm.statuses = statuses;
        }

        function followUser() {
            UserService.follow({ username : vm.user.username }, { friend: !vm.user.friend, friendShip: true },
                function() {
                    vm.user.friend = !vm.user.friend;
                });
        }

        function toggleActivateUser() {
            var confirmPopup;
            if (vm.user.activated) {
                confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('user.deactivate.title'),
                    template: '<span translate="user.deactivate.confirmation"></span>'
                });
            } else {
                confirmPopup = $ionicPopup.confirm({
                    title: $translate.instant('user.reactivate.title'),
                    template: '<span translate="user.reactivate.confirmation"></span>'
                });
            }

            confirmPopup.then(checkDelete);

            checkDelete.$inject = ['decision'];
            function checkDelete(decision) {
                if(decision) {
                    UserService.deactivate({ username : vm.user.username }, {activate: true},
                        function() {
                            vm.user.activated = !vm.user.activated;
                        });
                }
            }
        }

        function blockUser() {
            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('user.block.title'),
                template: '<span translate="user.block.confirmation"></span>'
            });

            confirmPopup.then(checkDelete);

            checkDelete.$inject = ['decision'];
            function checkDelete(decision) {
                if(decision) {
                    BlockService.updateBlockedUser( {username: vm.user.username }, function () {
                            ToastService.display('user.block.success');
                        }
                    );
                }
            }

        }

        $ionicPopover.fromTemplateUrl('app/shared/state/profile/userOptionsMenu.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });
    }
})();
