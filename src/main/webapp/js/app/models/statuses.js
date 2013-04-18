(function(Backbone, Tatami){

    var Statuses = Backbone.Model.extend({
        idAttribute: 'statusId',

        defaults: {
            timelineId: null,
            username: null,
            statusPrivate: '',
            groupId: '',
            groupName: '',
            publicGroup: false,
            attachmentIds: '',
            attachments: '',
            content: '',
            statusDate: 0,
            iso8601StatusDate: '',
            prettyPrintStatusDate: '',
            replyTo: '',
            replyToUsername: '',
            firstName: '',
            lastName: '',
            gravatar: '',
            favorite: false,
            shared: false,
            detailsAvailable: false,
            sharedByUsername: false
        },

        urlRoot: '/tatami/rest/new/statuses/',

        toJSON: function(){
            var attr = Backbone.Model.prototype.toJSON.call(this);

            attr.fullName = this.getFullName();

            return attr;
        },

        getFullName: function(){
            var fullName = [];

            if (this.get('firstName')) fullName.push(this.get('firstName'));
            if (this.get('lastName')) fullName.push(this.get('lastName'));

            return fullName.join(' ');
        }
    });

    Tatami.Models.Statuses = Statuses;

})(Backbone, Tatami);