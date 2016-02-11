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
            .state('follower.profile', {
                url: '/profile/:username',
                views: {
                    'follower@follow': {
                        templateUrl: 'app/components/profile/profile.html',
                        controller: 'ProfileCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    user: getUser,
                    statuses: getStatuses,
                    currentUser: getCurrentUser
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

    getStatus.$inject = ['StatusService', '$stateParams'];
    function getStatus(StatusService, $stateParams) {
        return StatusService.get({ statusId : $stateParams.statusId }).$promise;
    }
})();
