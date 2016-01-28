(function() {
    'use strict';

    angular.module('tatami')
        .config(conversationConfig);

    conversationConfig.$inject = ['$stateProvider'];
    function conversationConfig($stateProvider) {
        $stateProvider
            .state('conversation', {
                url: '/conversation/:statusId',
                parent: 'tatami',
                controller: 'ConversationCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/components/conversation/conversation.html',
                resolve: {
                    status: getStatus
                }
            })
    }

    getStatus.$inject = ['StatusService', '$stateParams'];
    function getStatus(StatusService, $stateParams) {
        console.log('getting status');
        return StatusService.get({ statusId : $stateParams.statusId }).$promise;
    }
})();
