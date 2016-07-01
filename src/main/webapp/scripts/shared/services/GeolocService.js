/**
 * This service is used to handle getting the geolocalisation of a user
 */

tatamiJHipsterApp
.factory('GeolocalisationService', ['$http', '$q', function($http, $q) {
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
            return 'https://www.openstreetmap.org/?mlon=' + this.getLongitude(position)
                + '&mlat=' + this.getLatitude(position);
        },

        getLatitude: function(position) {
            return position.split(',')[0].trim();
        },

        getLongitude: function(position) {
            return position.split(',')[1].trim();
        },
        
        getGeoLocDetails: function (status) {
            var url = " http://nominatim.openstreetmap.org/reverse?format=json&json_callback=JSON_CALLBACK&" +
                "lat=" + this.getLatitude(status.geoLocalization) + "&lon=" + this.getLongitude(status.geoLocalization);

            var deferred = $q.defer();
            $http.jsonp(url)
                .success(function (details) {
                    deferred.resolve(details.address);
                });
            return deferred.promise;
        }
    }
}]);
