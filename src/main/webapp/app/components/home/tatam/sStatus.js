/**
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
            var Status = $resource('/tatami/rest/statuses/');
            Status.save(tatam.status, function () {
                tatam.reset();
            });
        },

        getTimelineStatuses: function(){
            var Status = $resource('/tatami/rest/statuses/home_timeline');
            Status.get();
        },

        getStatus: function(statusId){
            var Status = $resource('/tatami/rest/statuses/:sId', {sId: '@id'});
            Status.get({sId: statusId});
        }
    }

}]);