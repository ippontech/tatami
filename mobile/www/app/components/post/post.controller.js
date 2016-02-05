(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['StatusService', 'PathService', '$ionicHistory', '$state', '$cordovaCamera', 'repliedToStatus'];
    function postCtrl(StatusService, PathService, $ionicHistory, $state, $cordovaCamera, repliedToStatus) {
        var vm = this;
        vm.charCount = 750;
        vm.status = {
            content: repliedToStatus ? '@' + repliedToStatus.username : '',
            statusPrivate: repliedToStatus ? repliedToStatus.private : false,
            replyTo: repliedToStatus ? repliedToStatus.statusId : '',
            replyToUsername: repliedToStatus ? repliedToStatus.username : '',
            attachmentIds: []
        };
        vm.images = [];

        vm.post = post;
        vm.reset = reset;
        vm.close = close;
        vm.getPicture = getPicture;
        vm.getPictureFromLibrary = getPictureFromLibrary;

        function post() {
            upload();
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
            };
            vm.images = [];
            vm.attachmentIds = [];
        }

        function close() {
            $ionicHistory.goBack();
            reset();
        }

        function getPicture() {
            $cordovaCamera.getPicture().then(store);
        }

        function getPictureFromLibrary() {
            var options = {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function store(fileUri) {
            vm.images.push(fileUri);
        }

        function upload() {
            var options = new FileUploadOptions();
            var fileTransfer = new FileTransfer();
            angular.forEach(vm.images, function(image) {
                options.fileName = image.substr(image.lastIndexOf('/') + 1);
                var imageData = readFileAsBinaryString(image);
                options.params = { 'uploadFile': imageData };

                fileTransfer.upload(image, PathService.buildPath('/tatami/rest/fileupload'), onSuccess, onFail, options);
            })

        }

        function readFileAsBinaryString(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var imgData = e.target.result;
                return imgData;
            };
            reader.onerror = function(e) {
                console.log("Error while reading file as binary string: "+e.target.error.code);
            };
            reader.readAsBinaryString(file);
        }

        function onSuccess(response) {
            console.log(response);
        }

        function onFail(failure) {
            console.log(failure);
        }
    }
})();
