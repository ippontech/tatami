(function(Backbone, Tatami){

    var MFile = Backbone.Model.extend({
        idAttribute: 'attachmentId',
        initialize: function(){
        }
    });

    var MQuota = Backbone.Model.extend({
        url : '/tatami/rest/attachments/quota',

        parse : function(data){
            var response = {};

            response.quota = data[0];

            return response;
        },

        defaults:
        {
            quota : ''
        }
    });

    Tatami.Models.File = MFile;
    Tatami.Models.Quota = MQuota;

})(Backbone, Tatami);