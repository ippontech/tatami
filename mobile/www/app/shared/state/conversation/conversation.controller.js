(function() {
    'use strict';

    angular.module('tatami')
        .controller('ConversationCtrl', conversationCtrl);

    conversationCtrl.$inject = ['$ionicPopup', '$ionicHistory', '$state', 'originalStatus', 'conversation', 'currentUser'];
    function conversationCtrl($ionicPopup, $ionicHistory, $state, originalStatus, conversation, currentUser) {
        var vm = this;
        vm.conversation = buildStatusList();
        vm.currentUser = currentUser;

        function buildStatusList() {
            try {
                return conversation.discussionStatuses.concat(originalStatus).sort(byDate);
            } catch (error) {
                var deletedPopup = $ionicPopup.alert({
                    title: 'Status Not Found!',
                    template: 'The original status has been deleted. <br>Returning to previous state.'
                });

                deletedPopup.then(goBack);
            }
        }

        function goBack() {
            $ionicHistory.goBack();
        }

        byDate.$inject = ['first', 'second'];
        function byDate(first, second) {
            return first.statusDate - second.statusDate;
        }
    }
})();
