(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = [
        '$state',
        '$localStorage',
        'currentUser'
    ];
    function moreController($state, $localStorage, currentUser) {
        var vm = this;

        vm.currentUser = currentUser;
        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;
        vm.goToSettings = goToSettings;
        vm.goToBlockedUsers = goToBlockedUsers;

        vm.goToReportedStatus = goToReportedStatus;

        function logout() {
            $localStorage.signOut();
            $state.go('login');
        }

        function goToCompanyTimeline() {
            $state.go('company');
        }

        function goToSettings() {
            $state.go('settings');
        }

        function goToBlockedUsers(){
            $state.go('blockedusers');
        }

        function goToReportedStatus(){
            $state.go('reportedStatus')
        }

    }
})();
