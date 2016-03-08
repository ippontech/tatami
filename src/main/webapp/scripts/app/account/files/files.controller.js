'use strict';

tatamiJHipsterApp
    .controller('FilesController', [
        '$scope',
        '$translate',
        'FilesService',
        'attachmentQuota',
        'fileList',
        'ngToast',
        function($scope, $translate, FilesService, attachmentQuota, fileList, ngToast) {

            // Initialize stuff
            $scope.quota = attachmentQuota[0];
            $scope.fileList = fileList;

            /**
             * Allows us to delete the supplied attachment
             * @param attachment
             */
            $scope.delete = function(attachment, removalIndex) {
                FilesService.delete({attachmentId: attachment}, { },
                    function() {
                        $scope.fileList.splice(removalIndex, 1);
                        $scope.$state.reload();
                        ngToast.create($translate.instant('tatami.form.deleted'));
                    });
            };

            $scope.getImgPath = function(thumbnail, attachmentId, filename) {
                if(thumbnail) {
                    return '/tatami/thumbnail/' + attachmentId + '/' + filename;
                }
                else {
                    return '/img/document_icon.png';
                }
            };

            $scope.setColor = function() {
                if($scope.quota <= 100 && $scope.quota >= 80) {
                    return "progress-bar progress-bar-danger";
                }
                else if($scope.quota < 80 && $scope.quota > 50) {
                    return "progress-bar progress-bar-warning";
                }
                else {
                    return "progress-bar progress-bar-success";
                }
            };
        }]);
