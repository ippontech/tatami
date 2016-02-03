(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['StatusService', '$ionicHistory', '$state', '$cordovaCamera', 'repliedToStatus'];
    function postCtrl(StatusService, $ionicHistory, $state, $cordovaCamera, repliedToStatus) {
        var vm = this;
        vm.charCount = 750;
        vm.status = {
            content: repliedToStatus ? '@' + repliedToStatus.username : '',
            statusPrivate: repliedToStatus ? repliedToStatus.private : false,
            replyTo: repliedToStatus ? repliedToStatus.statusId : '',
            replyToUsername: repliedToStatus ? repliedToStatus.username : ''
        };
        vm.imageUrl = undefined;

        vm.post = post;
        vm.reset = reset;
        vm.close = close;
        vm.getPicture = getPicture;

        function post() {
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

        function close() {
            $ionicHistory.goBack();
            reset();
        }

        function getPicture() {
            navigator.camera.getPicture().then(store);
        }

        function store(fileUri) {
            vm.imageUrl = 'data:image/jpeg;base64,' +  fileUri;
        }
    }
})();
