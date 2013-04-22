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

            var homeBody = Tatami.Factories.Home.homeBody();

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesTimeline();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('timeline');
        },

        homeMentions: function(){
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var homeBody = Tatami.Factories.Home.homeBody();

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesFavorites();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('mentions');

        },

        homeFavorites: function(){
            var homeSide = Tatami.Factories.Home.homeSide();
            Tatami.app.side.show(homeSide);

            homeSide.tagTrends.show(Tatami.Factories.Home.tagTrends());
            homeSide.cardProfile.show(Tatami.Factories.Home.cardProfile());

            var homeBody = Tatami.Factories.Home.homeBody();

            var region = Tatami.Factories.Status.getTimelineRegion();
            var timeline = Tatami.Factories.Status.statusesMentions();
            Tatami.app.body.show(homeBody);

            homeBody.tatams.show(region);

            region.refresh.show(Tatami.Factories.Status.getUpdateButton());
            region.timeline.show(timeline);

            timeline.collection.fetch();

            homeBody.show('favorites');

        }
    });

    Tatami.Router = Router;
})(Backbone, _, Tatami);