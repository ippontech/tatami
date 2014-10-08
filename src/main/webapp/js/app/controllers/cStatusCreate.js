/**
 * Created by kenny on 10/2/14.
 *
 * The purpose of this controller is to collect and maintain data in the tatam creation
 * window.
 */

tatamiApp.controller('tatamCreateCtrl', ['$scope', function($scope){
    $scope.content="";              // The content contained in this tatam
    $scope.preview=false;           // Determines if the tatam is being previewed by the user
    $scope.groupId="";              // The groupId that this tatam is being broadcast to
    $scope.attachmentIds=[];        // An array of all the attachments contained in the tatam
    $scope.geoLocalization="";      // The geo location of the user when sending the tatam
    $scope.statusPrivate=false;      // Determines whether the tatam is private

    /**
     *
     * @param param String argument representing the most up to date tatam content
     *
     * Simple function to change the current tatam content status
     */
    $scope.statusChange = function(param){
        $scope.content = param;
    }

    /**
     * Constructs a JSON object from the data of our scope. This JSON object will be
     * stored in the database.
     */
    $scope.toJSON = function(){
        var jsonObj = {
            content: $scope.content,
            groupId: $scope.groupId,
            attachmentIds: $scope.attachmentIds,
            geoLocalization: $scope.geoLocalization,
            statusPrivate: $scope.statusPrivate
        }
        console.log(angular.toJson(jsonObj));
    }

    $scope.storeStatus = function($scope, $http){
        $http.post(/tatami/statuses, toJSON()).
        success(function(){}).
            error(function(){});
    }

}])
