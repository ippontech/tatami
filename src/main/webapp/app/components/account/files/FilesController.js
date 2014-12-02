FilesModule.controller('FilesController', ['$scope', 'FilesService', function($scope, FilesService) {

    /**
     * Gets the total % of the files currently uploaded to the server.
     */
    $scope.getQuota = function() {
        FilesService.getQuota(function(result) {
            $scope.quota = result[0];
        });
    };

    /**
     * Get the array of files from the server using FilesService
     */
    $scope.getFiles = function (){
        FilesService.query(function(result) {
            $scope.fileList = result;
        })
    };

    // Initialize stuff
    $scope.getQuota();
    $scope.getFiles();

    /**
     * Allows us to delete the supplied attachment
     * @param attachment
     */
    $scope.delete = function(attachment) {
        FilesService.delete({attachmentId: attachment}, { },
            function() {
                $scope.remove(attachment);
                $scope.getQuota();
            });
    };

    $scope.remove = function (file, removalIndex){
        $scope.fileList.splice(removalIndex, 1);
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