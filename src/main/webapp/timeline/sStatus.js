/**
 * Created by kenny on 10/11/14.
 *
 * The StatusService is used to create new statuses, and edit existing statuses.
 */

tatamiApp.factory('StatusService', [ '$resource', function($resource){
    //return $resource('/tatami/rest/statuses/:statusId');
    return {
        /**
         * Create a new status update
         * @param tatam
         */

        newStatus: function(tatam){
            var Status = $resource('/tatami/rest/statuses/:statusId');
            Status.save(tatam);
            //getTimelineStatuses();
        },

        getTimelineStatuses: function(){
            var Status = $resource('/tatami/rest/statuses/home_timeline');
            Status.get();
        }
    }

}]);