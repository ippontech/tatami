(function() {
    'use strict';

    angular.module('tatami')
        .controller('FollowingCtrl', FollowingCtrl);

    FollowingCtrl.$inject = ['following'];

    function FollowingCtrl(following) {
        var vm = this;
        vm.following = following;
    }

})();

