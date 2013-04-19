(function(Backbone, _, Tatami){

    var Router = Backbone.Marionette.AppRouter.extend({
        routes: {
            'timeline' : 'homeTimeline',
            'mentions' : 'homeMentions',
            'favorites' : 'homeFavorites',
            '*actions' : 'defaults'
        },

        // Home

        defaults: function() {
            Backbone.history.navigate('timeline', true);
        },

        homeTimeline: function(){
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var c = new Tatami.Collections.Statuses();

            Tatami.app.body.show(new Tatami.Views.Statuses({
                collection: c
            }));

            c.fetch();
        },

        homeMentions: function(){
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());


            Tatami.app.body.close();

        },

        homeFavorites: function(){
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            Tatami.app.body.close();
        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);