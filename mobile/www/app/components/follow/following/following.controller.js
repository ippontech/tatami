(function() {
    'use strict';

    angular.module('tatami')
        .controller('FollowingCtrl', FollowingCtrl);

    FollowingCtrl.$inject = ['following', 'TatamiUserRefresherService', 'currentUser'];

    function FollowingCtrl(following, TatamiUserRefresherService, currentUser) {
        var vm = this;
        vm.following = following;
        vm.getNewFollowing = getNewFollowing;

        function getNewFollowing() {
            TatamiUserRefresherService.refreshFollowing(currentUser).then(setUsers);
        }

        setUsers.$inject = ['following'];
        function setUsers(following) {
            vm.following = following;
        }
    }

})();

