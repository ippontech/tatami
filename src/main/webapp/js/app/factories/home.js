(function(Backbone, _, Tatami){

    Tatami.Factories.Home = {
        homeSide: function(){
            return new Tatami.Views.HomeSide();
        },
        homeBody: function(){
            return new Tatami.Views.HomeBody();
        },
        tagTrends: function(username){
            var data = _.extend({
                popular: true
            }, (username)?{
                user: username
            }: null);

            var tags = new Tatami.Collections.Tags();

            View = (username)?Tatami.Views.TagTrendsProfile:Tatami.Views.TagTrends;
            tagTrends = new View({
                collection: tags
            });

            tags.fetch({
                data: data
            });

            return tagTrends;
        },
        cardProfile: function(){
            var cardProfile = new Tatami.Views.CardProfile({
                model: Tatami.app.user
            });

            cardProfile.model.fetch();
            return cardProfile;
        },
        groups: function(){
            var groups = new Tatami.Views.Groups({
                collection: Tatami.app.groups
            });

            return groups;
        },
        whoToFollow: function(){
            var c = new Tatami.Collections.WhoToFollow();
            c.fetch();
            return new Tatami.Views.WhoToFollow({
                collection: c
            });
        }
    };

})(Backbone, _, Tatami);