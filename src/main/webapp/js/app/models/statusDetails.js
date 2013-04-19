(function(Backbone, Tatami){

    var StatusDetails = Backbone.Model.extend({
        idAttribute: 'statusId',

        parse: function(data){
          var shares = data.sharedByLogins;

          data.sharedByLogins = [];
          shares.forEach(function(share){
            data.sharedByLogins.push({
              id : share
            });
          });

          return data;
        },

        defaults: {
            discussionStatuses: [],
            sharedByLogins: []
        },

        urlRoot: '/tatami/rest/statuses/details/'
    });

    Tatami.Models.StatusDetails = StatusDetails;

})(Backbone, Tatami);