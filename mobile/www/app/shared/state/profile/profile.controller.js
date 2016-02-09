(function() {
    'use strict';

    angular.module('tatami')
        .controller('ProfileCtrl', profileCtrl);

    profileCtrl.$inject = ['user', 'statuses', 'currentUser'];
    function profileCtrl(user, statuses, currentUser) {
        var vm = this;
        vm.user = user;
        vm.statuses = statuses;
        vm.currentUser = currentUser;
    }
})();
