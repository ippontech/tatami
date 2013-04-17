(function(Backbone, _, Tatami){

    var Router = Backbone.Marionette.AppRouter.extend({
        routes: {
            'timeline' : 'homeTimeline',
            'mentions' : 'homeMentions',
            'favorites' : 'homeFavorites',
            '*actions' : 'homeTimeline'
        },

        // Home

        homeTimeline: function(){
            Tatami.app.side.show(new Tatami.Views.CardProfile({
                model: Tatami.app.user
            }));
        },

        homeMentions: function(){
            Tatami.app.header.close();
        },

        homeFavorites: function(){
            var tags = new Tatami.Collections.Tags();
            window.t = tags;
            Tatami.app.side.show(new Tatami.Views.TagTrends({
                collection: tags
            }));
            tags.fetch({
                data:{
                    popular: true
                }
            });
        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);