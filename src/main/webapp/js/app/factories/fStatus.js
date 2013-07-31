(function(Backbone, Tatami){

    var statusDetails = new (Backbone.Collection.extend({
        model : Tatami.Models.StatusDetails
    }))();

    Tatami.Factories.Status = {

        getStatusDetail: function(id){
            var statusDetail = statusDetails.get(id);
            if(!statusDetail){
                var statusDetail = new Tatami.Models.StatusDetails({
                    statusId: id
                });
                statusDetails.add(statusDetail);
            }
            return statusDetail;
        },

        getTimelineRegion: function(){
            return new Tatami.Views.StatusTimelineRegion();
        },

        getWelcomeRegion: function(){
            return new Tatami.Views.WelcomeRegion();
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

        statusesCompany: function(){
            return new Tatami.Views.Statuses({
                collection: new Tatami.Collections.StatusesCompany()
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
        }, 

        statusesSearch: function(input){
            var c = new Tatami.Collections.StatusesSearch();
            c.input = input;
            
            return new Tatami.Views.Statuses({
                collection: c
            });
        }
    };

})(Backbone, Tatami);