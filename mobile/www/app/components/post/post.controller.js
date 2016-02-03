(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['StatusService', '$ionicHistory', '$state', '$cordovaCamera', '$window', 'repliedToStatus'];
    function postCtrl(StatusService, $ionicHistory, $state, $cordovaCamera, $window, repliedToStatus) {
        var vm = this;
        vm.window = $window;
        vm.charCount = 750;
        vm.status = {
            content: repliedToStatus ? '@' + repliedToStatus.username : '',
            statusPrivate: repliedToStatus ? repliedToStatus.private : false,
            replyTo: repliedToStatus ? repliedToStatus.statusId : '',
            replyToUsername: repliedToStatus ? repliedToStatus.username : ''
        };
        vm.images = [];

        vm.post = post;
        vm.reset = reset;
        vm.close = close;
        vm.getPicture = getPicture;
        vm.getPictureFromLibrary = getPictureFromLibrary;

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
            var options = {
                targetHeight: 450
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function getPictureFromLibrary() {
            console.log($window.innerWidth);
            console.log('here');
            var options = {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: $window.innerWidth,
                targetHeight: 450
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function store(fileUri) {
            vm.images.push(fileUri);
        }
    }
})();
