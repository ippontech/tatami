(function() {
    'use strict';

    angular.module('tatami')
        .controller('ConversationCtrl', conversationCtrl);

    conversationCtrl.$inject = ['status'];
    function conversationCtrl(status) {
        var vm = this;
        vm.status = status;
    }
})();
