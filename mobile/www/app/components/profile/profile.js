(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    function config($stateProvider) {

            $stateProvider
                .state('profile', {
                    url: '/profile/:username',
                    templateUrl: 'app/components/profile/profile.html',
                    controller: 'ProfileCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        user: getUser,
                        statuses: getStatuses,
                        currentUser: getCurrentUser
                    }
                });
    }

    getUser.$inject = ['UserService', '$stateParams'];
    function getUser(UserService, $stateParams) {
        return UserService.get({ username : $stateParams.username }).$promise;
    }

    getStatuses.$inject = ['user', 'StatusService'];
    function getStatuses(user, StatusService) {
        return StatusService.getUserTimeline({ username: user.username }).$promise;
    }

    getCurrentUser.$inject = ['ProfileService'];
    function getCurrentUser(ProfileService) {
        return ProfileService.get().$promise;
    }

})();
