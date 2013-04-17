(function(Backbone, Tatami){

    var Attachments = Backbone.Model.extend({
        idAttribute:'attachmentId',

        urlRoot: '/tatami/rest/attachments',

        default :{
            attachmentId:''
        }

    });

    Tatami.Models.Attachments = Attachments;

})(Backbone, Tatami);
