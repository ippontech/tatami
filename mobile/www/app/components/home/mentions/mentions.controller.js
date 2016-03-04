(function() {
    'use strict';

    angular.module('tatami')
        .controller('MentionsCtrl', mentionsCtrl);

    mentionsCtrl.$inject = ['mentioned', 'currentUser', 'TatamiStatusRefresherService'];
    function mentionsCtrl(mentioned, currentUser, TatamiStatusRefresherService) {
        var vm = this;
        vm.mentioned = mentioned;
        vm.currentUser = currentUser;

        vm.remove = remove;
        vm.getNewStatuses = getNewStatuses;
        vm.getOldStatuses = getOldStatuses;

        remove.$inject = ['mention'];
        function remove(mention) {
            vm.mentioned.splice(vm.mentioned.indexOf(mention), 1);
        }

        function getNewStatuses() {
            return TatamiStatusRefresherService.refreshMentions();
        }

        getOldStatuses.$inject = ['finalStatus'];
        function getOldStatuses(finalStatus) {
            return TatamiStatusRefresherService.getOldMentions(finalStatus);
        }
    }
})();
