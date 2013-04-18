(function(Backbone, Tatami){

    var statusDetails = new (Backbone.Collection.extend({
        model : Tatami.Models.StatusDetails
    }))();

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
        statusShares: function(statusDetail){
            var collection = new Backbone.Collection();
            statusDetail.fetch({
                success: function(model){
                    collection.set(statusDetail.get('sharedByLogins'));
                }
            });

            return new Tatami.Views.StatusShares({
                collection: collection
            });
        },

        statusesTimeline: function(){
            
        },

        statusesFavorite: function(){
            
        },

        statusesMentions: function(){
            
        },

        statusesDiscussion: function(statusDetail){
            var collection = new Tatami.Collections.Statuses();
            statusDetail.fetch({
                success: function(model){
                    collection.set(statusDetail.get('discussionStatuses'));
                }
            });

            return new Tatami.Views.Statuses({
                collection: collection,
                itemViewOptions: {
                    discussion: false
                } 
            });
        }
    };

})(Backbone, Tatami);