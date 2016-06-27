(function() {
    'use strict';

    angular.module('tatami')
        .controller('PostCtrl', postCtrl);

    postCtrl.$inject = [
        'StatusService',
        'PathService',
        '$ionicHistory',
        '$state',
        '$cordovaCamera',
        '$q',
        '$ionicLoading',
        '$ionicPopup',
        'repliedToStatus',
        '$scope'
    ];
    function postCtrl(StatusService, PathService, $ionicHistory, $state, $cordovaCamera, $q, $ionicLoading, $ionicPopup, repliedToStatus, $scope) {
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
        vm.isPosting = false;
        vm.remainingLength = vm.charCount;
        vm.newLineCount = 0; //This field takes into consideration the '\n' character that counts for 2 chars in the database.
        vm.pasteFlag = false;

        vm.post = post;
        vm.reset = reset;
        vm.close = close;
        vm.getPicture = getPicture;
        vm.getPictureFromLibrary = getPictureFromLibrary;
        vm.remove = remove;
        vm.paste = paste;


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
            vm.isPosting = false;
        }

        function close() {
            $ionicHistory.goBack();
            reset();
        }

        function getPicture() {
            var options = {
                quality: 10,
                correctOrientation : true
            };

            $cordovaCamera.getPicture(options).then(store);
        }

        function getPictureFromLibrary() {
            var options = {
                quality: 10,
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
            vm.isPosting = true;

            var options = new FileUploadOptions();
            var fileTransfer = new FileTransfer();
            angular.forEach(vm.images, function(image) {
                var deferred = $q.defer();
                options.fileKey = 'uploadFile';
                options.fileName = image.substr(image.lastIndexOf('/') + 1);

                $ionicLoading.show({
                    template: '<span translate="post.progress">Post in progress...</span>',
                    hideOnStateChange: true
                });

                fileTransfer.upload(image, PathService.buildPath('/tatami/rest/fileupload'), onSuccess, onFail, options);
                promises.push(deferred.promise);

                function onSuccess(result) {
                    var jsonResult = JSON.parse(result.response)[0];
                    deferred.resolve(jsonResult.attachmentId);
                }

                function onFail(failure) {
                    $ionicLoading.hide();

                    var popupError = $ionicPopup.alert({
                        title: 'Error',
                        template: '<span translate="post.error.message"></span>'
                    });

                    popupError.then(goToTimeline);

                    function goToTimeline() {
                        reset();
                        $state.go('timeline');
                    }

                    deferred.resolve(failure);
                }
            });

            return $q.all(promises);
        }

        function remove(index) {
            vm.images.splice(index, 1);
        }

        function updateRemainingLength(statusContent) {
            vm.remainingLength = vm.charCount - statusContent.length - vm.newLineCount;
        }

        function updateNewLineCount(statusContent) {
            vm.newLineCount = (statusContent.match(/\n/g) || []).length;
        }

        $scope.$watch('vm.status.content', function (newValue) {
            if (newValue) {
                updateNewLineCount(newValue);
                updateRemainingLength(newValue);
                if(vm.remainingLength < 0){
                    if(vm.pasteFlag){
                        $ionicLoading.show({
                            template: '<span translate="post.error.truncated"></span>',
                            duration: 2500
                        });
                        vm.pasteFlag = false;
                    }
                    vm.status.content = newValue.slice(0, vm.charCount - vm.newLineCount);
                    updateNewLineCount(vm.status.content);
                    updateRemainingLength(vm.status.content);
                }
            } else {
                vm.remainingLength = vm.charCount;
                vm.newLineCount = 0;
            }
        });

        function paste(){
            vm.pasteFlag = true;
        }
    }
})();
