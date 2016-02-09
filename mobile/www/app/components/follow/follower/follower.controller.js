(function() {
    'use strict';

    angular.module('tatami')
        .controller('FollowerCtrl', followerCtrl);

    followerCtrl.$inject = ['followers'];
    function followerCtrl(followers) {
        var vm = this;
        vm.followers = followers;
    }
})();
