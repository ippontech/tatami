/**
 * Created by kenny on 10/11/14.
 *
 * The StatusService is used to create new statuses, and edit existing statuses.
 */

tatamiApp.factory('StatusService', function($resource){
    return {
        /**
         * Create a new status update
         * @param tatam
         */
        newStatus: function(tatam){
            /*
            $http.post(
                '/tatami/rest/statuses/',
                tatam
            ).success(function(data, status, headers, config){
                console.log('Post made');
            }).error(function(data,status,headers,config){

            });
            */
            var Status = $resource('/tatami/rest/statuses/');
            Status.save(tatam);
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
