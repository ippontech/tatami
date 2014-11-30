/**
 * The purpose of this controller is to collect and maintain data in the status 
 * creation window.
 */

PostModule.controller('StatusCreateController', ['$scope', 'StatusService', 'GeolocalisationService', 'GroupService', '$modalInstance',
        function($scope, StatusService, GeolocalisationService, GroupService, $modalInstance) {
    $scope.current = {                      // This is the current instance of the status window
        preview: false,                     // Determines if the status is being previewed by the user
        geoLoc: false,                      // Determine if the geolocalization checkbox is checked
        groups: GroupService.query(),       // The groups the user belongs to
        reply: false,                       // Determine if this status is a reply to another user
        uploadDone: true,                   // If the file upload is done, we should not show the progess bar
        uploadProgress: 0,                  // The progress of the file currently being uploaded
        upload:[],
        contentEmpty: true
    },
    $scope.status = {            // This is the current user status information
        content: "",             // The content contained in this status
        groupId: "",             // The groupId that this status is being broadcast to
        replyTo: "",             // The user we are replying to
        attachmentIds: [],       // An array of all the attachments contained in the status
        geoLocalization: "",     // The geographical location of the user when posting the status
        statusPrivate: false     // Determines whether the status is private
    },

<<<<<<< HEAD:src/main/webapp/app/components/home/status/StatusCreateController.js
    $scope.charCount = 750;
    $scope.currentStatus,

=======
>>>>>>> upstream/havoc:src/main/webapp/app/components/home/post/StatusCreateController.js
    /**
     * In order to set reply to a status, we must be able to set current status
     * after an asynchronous get request.
     */
    $modalInstance.setCurrentStatus = function(status) {
        $scope.currentStatus = status;
        $scope.status.content = '@' + $scope.currentStatus.username + ' ';
        $scope.current.reply = true;
        $scope.status.replyTo = status.statusId;
    },

    $scope.closeModal = function() {
        $modalInstance.dismiss();
        $scope.reset();
    },

    /**
     *
     * @param param String argument representing the most up to date status content
     *
     * Simple function to change the current status content
     */
    $scope.statusChange = function(param) {
        $scope.status.content = param;
    },

    /**
     * Resets any previously set status data
     */
    $scope.reset = function() {
        $scope.current.preview = false;
        $scope.current.geoLoc = false;
        $scope.current.uploadDone = true;
        $scope.current.uploadProgress = 0;

        $scope.status.content = "";
        $scope.status.groupId = "";
        $scope.status.attachmentIds = [];
        $scope.status.geoLocalization = "";
        $scope.status.replyTo = "";
        $scope.status.statusPrivate = false;
    },

    /**
     * Determine whether the user means to use location data on the current status
     */
    $scope.updateLocation = function() {
        if($scope.current.geoLoc) {
            GeolocalisationService.getGeolocalisation($scope.getLocationString);
        } else {
            $scope.status.geoLocalization = "";
        }

    },

    /**
     * Callback function used in getGeolocalisation. This function sets the status geolocation,
     * and brings up a map.
     */
    $scope.getLocationString = function(position) {
        $scope.status.geoLocalization = position.coords.latitude + ", " + position.coords.longitude;
        $scope.initMap();
    },

    /**
     * Create a new status based on the current data in the controller.
     * Uses the StatusService for this purpose, and we do nothing if no
     * content has been provided by the user.
     */
    $scope.newStatus = function() {
        /*
        StatusService.newStatus($scope);*/
        if($scope.status.content){
            StatusService.save($scope.status, function(){
                $scope.reset();
                $modalInstance.dismiss();
            })
        }
    },

    /**
     * Create a map displaying the users current location in the status
     */
    $scope.initMap = function() {
        if ($scope.current.geoLoc) {
            var geoLocalization = $scope.status.geoLocalization;
            var latitude = geoLocalization.split(',')[0].trim();
            var longitude = geoLocalization.split(',')[1].trim();

            map = new OpenLayers.Map("simpleMap");
            var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
            var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
            var lonLat = new OpenLayers.LonLat(parseFloat(longitude), parseFloat(latitude)).transform(fromProjection, toProjection);
            var mapnik = new OpenLayers.Layer.OSM();
            var position = lonLat;
            var zoom = 12;

            map.addLayer(mapnik);
            var markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);
            markers.addMarker(new OpenLayers.Marker(lonLat));
            map.setCenter(position, zoom);
        }
    }
}]);