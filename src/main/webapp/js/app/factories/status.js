(function(Backbone, Tatami){

    var statusDetails = new (Backbone.Collection.extend({
        model : Tatami.Models.StatusDetails
    }))();

    var statusTimeline = new Tatami.Views.StatusTimelineRegion();

    Tatami.Factories.Status = {
        getStatusDetail: function(id){
            var statusDetail = statusDetails.get(id);
            if(!statusDetail){
                statusDetail = new Tatami.Models.StatusDetails({
                    statusId: id
                });
                statusDetails.add(statusDetail);
            }
            return statusDetail;
        },

        getTimelineRegion: function(){
            return statusTimeline;
        },

        getUpdateButton: function(){
            return new Tatami.Views.StatusUpdateButton();
        },

        statusesTimeline: function(){
            return new Tatami.Views.Statuses({
                collection: new Tatami.Collections.StatusesTimeline()
            });
        },

        statusesFavorites: function(){
            return new Tatami.Views.Statuses({
                collection: new Tatami.Collections.StatusesFavorites()
            });
        },

        statusesMentions: function(){
            return new Tatami.Views.Statuses({
                collection: new Tatami.Collections.StatusesMentions()
            });
        },

        statusesTags: function(tagName){
            var c = new Tatami.Collections.StatusesTags();
            c.tag = tagName;

            return new Tatami.Views.Statuses({
                collection: c
            });
        },

        statusesGroups: function(groupId){
            var c = new Tatami.Collections.StatusesGroups();
            c.group = groupId;

            return new Tatami.Views.Statuses({
                collection: c
            });
        }
    };

})(Backbone, Tatami);