(function() {
    'use strict';

    angular.module('tatami')
        .controller('ConversationCtrl', conversationCtrl);

    conversationCtrl.$inject = ['status', '$ionicHistory'];
    function conversationCtrl(status, $ionicHistory) {
        var vm = this;
        vm.status = status;
        //$ionicHistory.goBack();
        console.log(vm.status);
    }
})();
