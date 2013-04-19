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

        statusesTimeline: function(){

        },

        statusesFavorite: function(){

        },

        statusesMentions: function(){

        }
    };

})(Backbone, Tatami);