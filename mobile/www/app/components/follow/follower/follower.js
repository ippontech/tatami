(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('follower', {
                url: '/follower',
                parent: 'follow',
                views: {
                    'follower': {
                        templateUrl: 'app/components/follow/follower/follower.html',
                        controller: 'FollowerCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    followers: followers
                }
            });
    }

    followers.$inject = ['UserService', 'currentUser'];
    function followers(UserService, currentUser) {
        return UserService.getFollowers({ username: currentUser.username }).$promise;
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('follower', 'follow');
        TatamiState.addConversationState('follower', 'follow');
        TatamiState.addTagState('follower', 'follow');
    }
})();
