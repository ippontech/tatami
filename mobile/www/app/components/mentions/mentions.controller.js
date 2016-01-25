(function() {
    'use strict';

    angular.module('tatami')
        .controller('MentionsCtrl', mentionsCtrl);

    mentionsCtrl.$inject = ['mentioned'];
    function mentionsCtrl(mentioned) {
        var vm = this;
        vm.mentioned = mentioned;

        vm.remove = remove;

        remove.$inject = ['mention'];
        function remove(mention) {
            vm.mentioned.splice(mentioned.indexOf(mention), 1);
        }
    }
})();
