(function(Backbone, Tatami){

    var statusDetails = new (Backbone.Collection.extend({
        model : Tatami.Models.StatusDetails
    }))();

    var statusTimeline = new Tatami.Views.StatusTimelineRegion();
    var updateButton = new Tatami.Views.StatusUpdateButton();

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
            return updateButton;
        },

        statusesTimeline: function(){
            return new Tatami.Views.Statuses({
                collection: new Tatami.Collections.Statuses(),
                autoRefresh: false
            });
        },

        statusesFavorite: function(){
            statusTimeline.refresh.show(new Tatami.Views.StatusUpdateButton());
        },

        statusesMentions: function(){
            statusTimeline.refresh.show(new Tatami.Views.StatusUpdateButton());
        }
    };

})(Backbone, Tatami);