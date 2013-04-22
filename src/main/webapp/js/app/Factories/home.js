(function(Backbone, Tatami){

    var homeSide, tagTrends, cardProfile;

    Tatami.Factories.Home = {
        homeSide: function(){
            if(!homeSide) homeSide = new Tatami.Views.HomeSide();

            return homeSide;
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
        }
    };

})(Backbone, Tatami);