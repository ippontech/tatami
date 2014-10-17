/**
 * Created by kenny on 10/11/14.
 *
 * The StatusService is used to create new statuses, and edit existing statuses.
 */

tatamiApp.factory('StatusService', function($resource){
    return {
        /**
         * Create a new status update
         * @param status
         */
        newStatus: function(status){
            var Status = $resource('/tatami/rest/statuses');
            Status.save(status);
        }

        /**
         * Update a status that already exists
         * @param statusId the ID of the status currently being edited
         * @param status the new status data
         */
            /*
        editStatus: function(statusId, status){
            var Status = $resource('/tatami/rest/statuses', null, {'update':{method: 'PUT'}});

        }*/
    }
})
