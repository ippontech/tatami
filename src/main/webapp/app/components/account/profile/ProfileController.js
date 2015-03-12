ProfileModule.controller('ProfileController', ['$scope', '$upload', '$translate', 'ProfileService', 'profileInfo', 'userLogin', 'ngToast',
    function($scope, $upload, $translate, ProfileService, profileInfo, userLogin, ngToast) {

        // Current state of the view
        $scope.current = {
            avatar: []
        };

        // Status of the current upload
        $scope.uploadStatus = {
            isUploading: false,
            progress: 0
        };

        // Resolve the user data, profileInfo is inherited from account state
        // Since profileInfo is a resolve from the parent state, updating the model will cause
        // the first and last name in the side bar and text area to sync. Is this undesired?
        $scope.userProfile = profileInfo;
        $scope.userLogin = userLogin.login;

        // Update the user information
        $scope.updateUser = function() {
            // Toast strings should be translatable
            ProfileService.update($scope.userProfile, function() {
                ngToast.create({
                    content: $translate.instant('tatami.account.profile.save')
                });
            }, function() {
                ngToast.create({
                    content: $translate.instant('tatami.form.fail'),
                    class: 'danger'
                });
            });
        };

        // Handle user avatar changes based on drag and drop
        $scope.$watch('current.avatar', function() {
            for(var i = 0; i < $scope.current.avatar.length; ++i){
                var file = $scope.current.avatar[i];
                $scope.uploadStatus.isUploading = true;
                $scope.upload = $upload.upload({
                    url: '/tatami/rest/fileupload/avatar',
                    file: file,
                    fileFormDataName: 'uploadFile'
                }).progress(function(evt) {
                    $scope.uploadStatus.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    $scope.uploadStatus.isUploading = false;
                    $scope.uploadStatus.progress = 0;
                    $scope.$state.reload();
                }).error(function(data, status, headers, config) {
                    $scope.uploadStatus.isUploading = false;
                    $scope.uploadStatus.progress = 0;
                })
            }
        });
    }
]);