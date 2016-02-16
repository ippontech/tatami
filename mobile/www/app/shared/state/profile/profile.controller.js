(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['user', 'statuses', 'currentUser', 'TatamiStatusRefresherService'];
    function profileCtrl(user, statuses, currentUser, TatamiStatusRefresherService) {
        var vm = this;
        vm.user = user;
        vm.statuses = statuses;
        vm.currentUser = currentUser;

        vm.getNewStatuses = getNewStatuses;

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshUserTimeline(user).then(setStatuses);
        }

        setStatuses.$inject = ['statuses'];
        function setStatuses(statuses) {
            vm.statuses = statuses;
        }
    }
})();
