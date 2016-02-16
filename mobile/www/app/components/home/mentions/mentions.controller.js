(function() {
    'use strict';

    angular.module('tatami')
        .controller('MentionsCtrl', mentionsCtrl);

    mentionsCtrl.$inject = ['mentioned', 'TatamiStatusRefresherService'];
    function mentionsCtrl(mentioned, TatamiStatusRefresherService) {
        var vm = this;
        vm.mentioned = mentioned;

        vm.remove = remove;
        vm.getNewStatuses = getNewStatuses;

        remove.$inject = ['mention'];
        function remove(mention) {
            vm.mentioned.splice(vm.mentioned.indexOf(mention), 1);
        }

        function getNewStatuses() {
            TatamiStatusRefresherService.refreshMentions().then(setStatuses);
        }

        setStatuses.$inject = ['mentioned'];
        function setStatuses(mentioned) {
            vm.mentioned = mentioned;
        }
    }
})();
