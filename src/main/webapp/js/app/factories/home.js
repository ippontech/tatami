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

            tagTrends = new Tatami.Views.TagTrends({
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
            return new Tatami.Views.WhoToFollow();
        }
    };

})(Backbone, _, Tatami);