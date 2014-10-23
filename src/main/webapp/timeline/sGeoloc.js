/**
 * Created by kenny on 10/23/14.
 *
 * This service is used to handle getting the geolocalisation of a user
 */
tatamiApp.factory('GeolocalisationService', function(){
    return{
        /**
         * Uses HTML5 to get geolocation information from the user
         * @returns If geolocation data can be found for the user
         *              then we return the position in the form
         *              "lat, lon"
         *          Otherwise, we return the empty string.
         */
        getGeolocalisation: function(){
            if(navigator.geolocation){
                return navigator.geolocation.getCurrentPosition(getPosition);
            } else{
                return '';
            }
        },

        /**
         * Function passed into the navigator.geolocation.getCurrentPosition
         * @param position The location data
         * @returns {string} The result is the location string of the form
         *          "lat, lon".
         */
        getPosition: function(position){
            return position.coords.latitude + ', ' + position.coords.longitude;
        },

        /**
         * Returns a string with the location data based on the openstreetmap website
         * @param position The users position
         * @returns {string} The URL to openstreetmaps
         */
        getGeolocUrl: function(position){
            var latitude = position.split(',')[0].trim();
            var longitude = position.split(',')[1].trim();
            return "http://www.openstreetmap.org/?lon="+longitude+"&lat="+latitude+"&mlon="+longitude+"&mlat="+latitude+"&zoom=12";
        }
    }
})