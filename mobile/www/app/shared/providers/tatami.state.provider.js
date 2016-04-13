(function() {
    'use strict';

    // This will dynamically create any tab substates inside the current tab. If in the timeline tab, we will
    // create a timeline.status state
    angular.module('tatami.providers')
        .provider('TatamiState', tatamiState);

    tatamiState.$inject = ['$stateProvider'];
    function tatamiState($stateProvider) {
        this.$get = tatamiStateHelper;

        function tatamiStateHelper() {

            var statusViewConfig = {
                templateUrl: 'app/shared/state/status/status.html',
                controller: 'StatusCtrl',
                controllerAs: 'vm'
            };

            var statusViews = [];
            statusViews['timeline@home'] = { 'timeline@home': statusViewConfig };
            statusViews['mentions@home'] = { 'mentions@home': statusViewConfig };
            statusViews['favorites@home'] = { 'favorites@home': statusViewConfig };
            statusViews['suggested@follow'] = { 'suggested@follow': statusViewConfig };
            statusViews['following@follow'] = { 'following@follow': statusViewConfig };
            statusViews['follower@follow'] = { 'follower@follow': statusViewConfig };
            statusViews['company@home'] = { 'more@home': statusViewConfig };

            var profileViewConfig = {
                templateUrl: 'app/shared/state/profile/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm'
            };

            var profileViews = [];
            profileViews['suggested@follow'] = { 'suggested@follow': profileViewConfig };
            profileViews['following@follow'] = { 'following@follow': profileViewConfig };
            profileViews['follower@follow'] = { 'follower@follow': profileViewConfig };
            profileViews['timeline@home'] = { 'timeline@home': profileViewConfig };
            profileViews['mentions@home'] = { 'mentions@home': profileViewConfig };
            profileViews['favorites@home'] = { 'favorites@home': profileViewConfig };
            profileViews['company@home'] = { 'more@home': profileViewConfig };

            var conversationViewConfig = {
                templateUrl: 'app/shared/state/conversation/conversation.html',
                controller: 'ConversationCtrl',
                controllerAs: 'vm'
            };

            var conversationViews = [];
            conversationViews['suggested@follow'] = { 'suggested@follow': conversationViewConfig };
            conversationViews['following@follow'] = { 'following@follow': conversationViewConfig };
            conversationViews['follower@follow'] = { 'follower@follow': conversationViewConfig };
            conversationViews['timeline@home'] = { 'timeline@home': conversationViewConfig };
            conversationViews['mentions@home'] = { 'mentions@home': conversationViewConfig };
            conversationViews['favorites@home'] = { 'favorites@home': conversationViewConfig };
            conversationViews['company@home'] = { 'more@home': conversationViewConfig };

            var service = {
                addStatusState: addStatusState,
                addProfileState: addProfileState,
                addConversationState: addConversationState
            };

            return service;

            addStatusState.$inject = ['prefixName', 'parentName'];
            function addStatusState(prefixName, parentName) {
                $stateProvider.state(prefixName + '.status', {
                    url: '/status/:statusId',
                    views: statusViews[prefixName + '@' + parentName],
                    resolve: {
                        status: getStatus
                    }
                });

                getStatus.$inject = ['$stateParams', 'StatusService'];
                function getStatus($stateParams, StatusService) {
                    return StatusService.get({ statusId : $stateParams.statusId }).$promise;
                }
            }

            addProfileState.$inject = ['prefixName', 'parentName'];
            function addProfileState(prefixName, parentName) {
                $stateProvider.state(prefixName + '.profile', {
                    url: '/profile/:username',
                    views: profileViews[prefixName + '@' + parentName],
                    resolve: {
                        user: getUser,
                        statuses: getStatuses,
                        currentUser: getCurrentUser
                    }
                });

                getUser.$inject = ['UserService', '$stateParams'];
                function getUser(UserService, $stateParams) {
                    return UserService.get({ username : $stateParams.username }).$promise;
                }

                getStatuses.$inject = ['user', 'StatusService'];
                function getStatuses(user, StatusService) {
                    return StatusService.getUserTimeline({ username: user.username }).$promise;
                }

                getCurrentUser.$inject = ['currentUser'];
                function getCurrentUser(currentUser) {
                    return currentUser;
                }
            }

            addConversationState.$inject = ['prefixName', 'parentName'];
            function addConversationState(prefixName, parentName) {
                $stateProvider.state(prefixName + '.conversation', {
                    url: '/conversation/:statusId',
                    views: conversationViews[prefixName + '@' + parentName],
                    resolve: {
                        originalStatus: getOriginalStatus,
                        conversation: getConversation
                    }
                });

                getOriginalStatus.$inject = ['StatusService', '$stateParams'];
                function getOriginalStatus(StatusService, $stateParams) {
                    return StatusService.get({ statusId : $stateParams.statusId }).$promise;
                }

                getConversation.$inject = ['StatusService', '$stateParams'];
                function getConversation(StatusService, $stateParams) {
                    return StatusService.getDetails({ statusId : $stateParams.statusId }).$promise;
                }
            }


        }
    }

})();
