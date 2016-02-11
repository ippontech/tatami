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
            })
            .state('follower.detail', {
                url: '/status/:statusId',
                views: {
                    'follower@follow': {
                        templateUrl: 'app/components/home/detail/detail.html',
                        controller: 'DetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    status: getStatus
                }
            })
    }

    followers.$inject = ['UserService', 'currentUser'];
    function followers(UserService, currentUser) {
        return UserService.getFollowers({ username: currentUser.username }).$promise;
    }

    getStatus.$inject = ['StatusService', '$stateParams'];
    function getStatus(StatusService, $stateParams) {
        return StatusService.get({ statusId : $stateParams.statusId }).$promise;
    }

    angular.module('tatami')
        .run(run);

    run.$inject = ['TatamiState'];
    function run(TatamiState) {
        TatamiState.addProfileState('follower', 'follow');
    }
})();
