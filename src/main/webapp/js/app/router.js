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
            Tatami.app.header.show(new Tatami.Views.HomeHeader());
        },

        homeMentions: function(){
            Tatami.app.header.close();
        },

        homeFavorites: function(){
            Tatami.app.header.close();
        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);