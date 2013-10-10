(function(Backbone, Tatami){

    var PostStatus = Backbone.Model.extend({
        defaults: {
            content: '',
            groupId: '',
            attachmentIds: [],
            replyTo: '',
            geoLocalization:'' ,
            statusPrivate: false
        },

        urlRoot: '/tatami/rest/statuses/',

        addAttachment: function(id){
            var attachments = this.get('attachmentIds');
            attachments.push(id);
            this.set('attachmentIds', attachments);
        },

        resetAttachments: function() {
            this.set('attachmentIds', []);
        }
    });

    Tatami.Models.PostStatus = PostStatus;

})(Backbone, Tatami);