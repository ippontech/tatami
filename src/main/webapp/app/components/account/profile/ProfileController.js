/**
 * There is a lot of logic in this controller. Running into some issues with the ProfileService. In the future,
 * the extra logic will be factored into ProfileService.
 */

ProfileModule.controller('ProfileController', ['$scope', '$resource', '$upload', 'ProfileService', 'UserService',
    function($scope, $resource, $upload, ProfileService, UserService) {

        $scope.init = function() {
            ProfileService.get(function(result) {
                $scope.userProfile = result;
                UserService.get({ username: result.username }, function(user) {
                    $scope.userLogin = user.login;
                });
            });
        };

        $scope.current = {
            avatar: []
        };

        $scope.uploadStatus = {
            isUploading: false,
            progress: 0
        }

        $scope.init();

        $scope.updateUser = function() {
            ProfileService.update($scope.userProfile);
        };

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
                    $scope.$state.transitionTo($scope.$state.current, $scope.$stateParams, { reload: true });
                }).error(function(data, status, headers, config) {
                    $scope.uploadStatus.isUploading = false;
                    $scope.uploadStatus.progress = 0;
                })
            }
        });

        // This is currently disabled until the back end is fixed to handle this correctly
        $scope.deleteUser = function(confirmMessage) {
            // Switch to a confirmation modal later
            if(confirm(confirmMessage)) {
                // ProfileService.delete();
                // Display success/failure message
            }
        }
    }
]);