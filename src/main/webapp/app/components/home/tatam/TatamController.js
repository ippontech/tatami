/**
 *
 * The purpose of this controller is to collect and maintain data in the tatam creation
 * window.
 */

tatamiApp.controller('tatamCreateCtrl', ['$scope', 'StatusService', 'GeolocalisationService', 'GroupService',
        function($scope, StatusService, GeolocalisationService, GroupService, $upload, $modalInstance){
    $scope.current = {                      // This is the current instance of the tatam window
        preview: false,                     // Determines if the tatam is being previewed by the user
        geoLoc: false,                      // Determine if the geolocalization checkbox is checked
        groups: GroupService.query(),       // The groups the user belongs to
        reply: false,                       // Determine if this tatam is a reply to another user
        uploadDone: true,                   // If the file upload is done, we should not show the progess bar
        uploadProgress: 0,                  // The progress of the file currently being uploaded
        upload:[]
    },
    $scope.status = {           // This is the current user tatam information
        content:"",             // The content contained in this tatam
        groupId:"",             // The groupId that this tatam is being broadcast to
        replyTo:"",             // The person we are replying to
        attachmentIds:[],       // An array of all the attachments contained in the tatam
        geoLocalization:"",     // The geo location of the user when sending the tatam
        statusPrivate:false     // Determines whether the tatam is private
    },


    $scope.submit = function () {
        $scope.newStatus();
        $modalInstance.close();
    },

    $scope.cancel = function () {
        $modalInstance.close();
        $scope.reset();
    }


    $scope.onFilesSelect = function ($files) {
        for(var i = 0; i < $files.length; ++i){
            var files = $files[i];
            $scope.current.uploadDone = false;

            $scope.current.upload = $upload.upload({
                url: '/tatami/rest/fileupload',
                method: 'POST'
            }).progress(function (evt) {
                $scope.current.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.current.uploadDone = true;
                console.log(data);
            })
        }
    },


    /**
     *
     * @param param String argument representing the most up to date tatam content
     *
     * Simple function to change the current tatam content status
     */
    $scope.statusChange = function(param){
        $scope.status.content = param;
    },

    /**
     * Resets any previously set status data
     */
    $scope.reset = function(){
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
     * Determine whether the user means to use location data on the current Tatam
     */
    $scope.updateLocation = function(){
        if($scope.current.geoLoc){
            GeolocalisationService.getGeolocalisation($scope.getLocationString);
        } else{
            $scope.status.geoLocalization = "";
        }

    },

    /**
     * Callback function used in getGeolocalisation. This function sets the status geolocation,
     * and brings up a map.
     */
    $scope.getLocationString = function (position) {
        $scope.status.geoLocalization = position.coords.latitude + ", " + position.coords.longitude;
        $scope.initMap();
    },

    /**
     * Create a new status based on the current data in the controller.
     * Uses the StatusService for this purpose, and we do nothing if no
     * content has been provided by the user.
     */
    $scope.newStatus = function(){
        /*
        StatusService.newStatus($scope);*/
        StatusService.save($scope.status, function () {
            $scope.reset();
        });
    },

    /**
     * Create a map displaying the users current location in the tatam
     */
    $scope.initMap = function () {
        if ($scope.current.geoLoc) {
            var geoLocalization = $scope.status.geoLocalization;
            var latitude = geoLocalization.split(',')[0].trim();
            var longitude = geoLocalization.split(',')[1].trim();

            map = new OpenLayers.Map("simpleMap");
            var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
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