(function(Backbone, Tatami){

    var StatusDetails = Backbone.Model.extend({
        idAttribute: 'statusId',

        defaults: {
            discussionStatuses: [],
            sharedByLogins: []
        }, 

        urlRoot: '/tatami/rest/statuses/details/'
    });

    Tatami.Models.StatusDetails = StatusDetails;

})(Backbone, Tatami);