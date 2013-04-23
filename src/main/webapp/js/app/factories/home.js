(function(Backbone, Tatami){

    var homeSide, homeBody, tagTrends, cardProfile, groups;

    Tatami.Factories.Home = {
        homeSide: function(){
            if(!homeSide) homeSide = new Tatami.Views.HomeSide();

            return homeSide;
        },
        homeBody: function(){
            if(!homeBody) homeBody = new Tatami.Views.HomeBody();

            return homeBody;
        },
        tagTrends: function(){
            if(tagTrends){
                tagTrends.collection.fetch({
                    data:{
                        popular: true
                    }
                });
                return tagTrends;
            }
            var tags = new Tatami.Collections.Tags();

            tagTrends = new Tatami.Views.TagTrends({
                collection: tags
            });

            tags.fetch({
                data:{
                    popular: true
                }
            });

            return tagTrends;
        },
        cardProfile: function(){
            if(cardProfile) return cardProfile;
            cardProfile = new Tatami.Views.CardProfile({
                model: Tatami.app.user
            });

            cardProfile.model.fetch();
            return cardProfile;
        },
        groups: function(){
            if(groups) return groups;
            groups = new Tatami.Views.Groups({
                collection: Tatami.app.groups
            });

            return groups;
        }
    };

})(Backbone, Tatami);