(function() {
    'use strict';

    angular.module('tatami')
        .controller('FollowerCtrl', followerCtrl);

    followerCtrl.$inject = ['followers', 'TatamiUserRefresherService', 'currentUser'];
    function followerCtrl(followers, TatamiUserRefresherService, currentUser) {
        var vm = this;
        vm.followers = followers;
        vm.getNewFollowers = getNewFollowers;

        function getNewFollowers() {
            TatamiUserRefresherService.refreshFollowers(currentUser).then(setUsers);
        }

        setUsers.$inject = ['followers'];
        function setUsers(followers) {
            vm.followers = followers;
        }
    }
})();
