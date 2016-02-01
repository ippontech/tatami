(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['StatusService', '$ionicHistory', '$state', 'repliedToStatus'];
    function postCtrl(StatusService, $ionicHistory, $state, repliedToStatus) {
        var vm = this;
        vm.charCount = 750;
        vm.status = {
            content: repliedToStatus ? '@' + repliedToStatus.username : '',
            statusPrivate: repliedToStatus ? repliedToStatus.private : false
        };

        vm.post = post;
        vm.reset = reset;

        function post() {
            console.log(StatusService);
            StatusService.save(vm.status, function() {
                reset();
                $ionicHistory.clearCache();
                $state.go('timeline');
            })
        }

        function reset() {
            vm.status = {
                content: '',
                statusPrivate: false
            }
        }
    }
})();
