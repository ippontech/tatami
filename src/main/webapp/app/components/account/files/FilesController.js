FilesModule.controller('FilesController', ['$scope', 'FilesService', 'attachmentQuota', 'fileList', function($scope, FilesService, attachmentQuota, fileList) {

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
                $scope.getQuota();
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
}]);