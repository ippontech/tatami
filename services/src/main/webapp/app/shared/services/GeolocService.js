/**
 * This service is used to handle getting the geolocalisation of a user
 */

TatamiApp.factory('GeolocalisationService', function() {
    return {
        
        /**
         * Uses HTML5 to get geolocation information from the user
         * @returns If geolocation data can be found for the user
         *              then we return the position in the form
         *              "lat, lon"
         *          Otherwise, we return the empty string.
         */
        getGeolocalisation: function(callback) {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position) {
                    callback(position);
                });
            }
        },

        /**
         * Returns a string with the location data based on the openstreetmap website
         * @param position The users position
         * @returns {string} The URL to openstreetmaps
         */
        getGeolocUrl: function(position) {
            var latitude = position.split(',')[0].trim();
            var longitude = position.split(',')[1].trim();
            return 'https://www.openstreetmap.org/?mlon=' + longitude + '&mlat=' + latitude;
        }
    }
});