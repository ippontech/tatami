(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('TatamiUserRefresherService', tatamiUserRefresherService);

    tatamiUserRefresherService.$inject = ['$rootScope', 'UserService'];
    function tatamiUserRefresherService($rootScope, UserService) {
        var service = {
            refreshSuggested: refreshSuggested,
            refreshFollowers: refreshFollowers,
            refreshFollowing: refreshFollowing,
            getNextUsers: getNextUsers,
            updateInfiniteUsers: updateInfiniteUsers
        };

        return service;

        function refreshSuggested() {
            return UserService.getSuggestions().$promise.then(updateUsers);
        }

        refreshFollowers.$inject = ['currentUser'];
        function refreshFollowers(currentUser) {
            return UserService.getFollowers({ username: currentUser.username }).$promise.then(updateUsers);
        }

        refreshFollowing.$inject = ['currentUser'];
        function refreshFollowing(currentUser) {
            return UserService.getFollowing({ username: currentUser.username }).$promise.then(updateUsers);
        }

        updateUsers.$inject = ['users'];
        function updateUsers(users) {
            $rootScope.$broadcast('scroll.refreshComplete');

            return users;

        }

        getNextUsers.$inject = ['usersCount'];
        function getNextUsers(usersCount) {
            return UserService.query({ pagination: usersCount }).$promise.then(updateInfiniteUsers);
        }

        updateInfiniteUsers.$inject = ['users'];
        function updateInfiniteUsers(users) {
            $rootScope.$broadcast('scroll.infiniteScrollComplete');

            return users;
        }
    }
})();
