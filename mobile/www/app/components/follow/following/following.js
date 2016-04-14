(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('following', {
                url: '/following',
                parent: 'follow',
                views: {
                    'following': {
                        templateUrl: 'app/components/follow/following/following.html',
                        controller: 'FollowingCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    following: getFollowing
                }
            });
    }

    getFollowing.$inject = ['UserService', 'currentUser'];
    function getFollowing(UserService, currentUser) {
        return UserService.getFollowing({ username: currentUser.username }).$promise;
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('following', 'follow');
        TatamiState.addConversationState('following', 'follow');
        TatamiState.addTagState('following', 'follow');
    }
})();
