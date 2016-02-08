(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = ['StatusService', 'PathService', '$ionicHistory', '$state', '$cordovaCamera', '$q', 'repliedToStatus'];
    function postCtrl(StatusService, PathService, $ionicHistory, $state, $cordovaCamera, $q, repliedToStatus) {
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
            upload().then(createPost);
        }

        function createPost(attachmentIds) {
            vm.status.attachmentIds = attachmentIds;
            StatusService.save(vm.status, function() {
                reset();
                $ionicHistory.clearCache();
                $state.go('timeline');
            });
        }

        function reset() {
            vm.status = {
                content: '',
                statusPrivate: false,
                attachmentIds: []
            };
            vm.images = [];
        }

        function close() {
            $ionicHistory.goBack();
            reset();
        }

        function getPicture() {
            var options = {
                correctOrientation : true
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function getPictureFromLibrary() {
            var options = {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function store(fileUri) {
            vm.images.push(fileUri);
        }

        function upload() {
            var promises = [];
            var deferred = $q.defer();

            var options = new FileUploadOptions();
            var fileTransfer = new FileTransfer();
            angular.forEach(vm.images, function(image) {
                options.fileKey = 'uploadFile';
                options.fileName = image.substr(image.lastIndexOf('/') + 1);

                fileTransfer.upload(image, PathService.buildPath('/tatami/rest/fileupload'), onSuccess, onFail, options);
                promises.push(deferred.promise);
            });

            function onSuccess(result) {
                var jsonResult = JSON.parse(result.response)[0];
                deferred.resolve(jsonResult.attachmentId);
            }

            function onFail(failure) {
                console.log(failure);
                deferred.resolve(failure);
            }

            return $q.all(promises);
        }

        function onSuccess(result) {
            var jsonResult = JSON.parse(result.response)[0];
            deferred.resolve(jsonResult.attachmentId);
            vm.status.attachmentIds.push(jsonResult.attachmentId);
        }

        function onFail(failure) {
            console.log(failure);
        }
    }
})();
