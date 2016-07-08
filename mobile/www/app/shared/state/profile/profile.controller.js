(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['user', 'statuses', 'currentUser', 'TatamiStatusRefresherService', 'UserService'];
    function profileCtrl(user, statuses, currentUser, TatamiStatusRefresherService, UserService) {
        var vm = this;
        vm.user = user;
        vm.statuses = statuses;
        vm.currentUser = currentUser;
        vm.isCurrentUser = (vm.currentUser.username === vm.user.username);

        vm.followUser = followUser;
        vm.getNewStatuses = getNewStatuses;

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
    }
})();
