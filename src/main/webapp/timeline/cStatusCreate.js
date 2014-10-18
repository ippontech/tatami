/**
 * Created by kenny on 10/2/14.
 *
 * The purpose of this controller is to collect and maintain data in the tatam creation
 * window.
 */

tatamiApp.controller('tatamCreateCtrl', function($scope, StatusService){
    preview=false;           // Determines if the tatam is being previewed by the user
    $scope.status = {
        content:"",             // The content contained in this tatam
        groupId:"",             // The groupId that this tatam is being broadcast to
        replyTo:"",             // The person we are replying to
        attachmentIds:[],       // An array of all the attachments contained in the tatam
        geoLocalization:"",     // The geo location of the user when sending the tatam
        statusPrivate:false     // Determines whether the tatam is private
    }


    /**
     *
     * @param param String argument representing the most up to date tatam content
     *
     * Simple function to change the current tatam content status
     */
    $scope.statusChange = function(param){
        $scope.status.content = param;
    }

    /**
     * Resets any previously set status data
     */
    $scope.reset = function(){
        $scope.status.content = "";
        $scope.status.preview = false;
        $scope.status.groupId = "";
        $scope.status.attachmentIds = [];
        $scope.status.geoLocalization = "";
        $scope.status.replyTo = "";
        $scope.status.statusPrivate = false;
    }
    /**
     * Create a new status based on the current data in the controller.
     * Uses the StatusService for this purpose
     */
    $scope.newStatus = function(){
        StatusService.newStatus(JSON.stringify($scope.status));
    }

})
