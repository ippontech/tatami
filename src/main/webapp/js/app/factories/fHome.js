(function(Backbone, _, Tatami){

    Tatami.Factories.Home = {
        homeSide: function(){
            return new Tatami.Views.HomeSide();
        },
        homeBody: function(tabName){
            var model = new Tatami.Models.HomeBody({'tabName':tabName});
            return new Tatami.Views.HomeBody({'model': model});
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

        tagsFollow: function(){
            var c = new Tatami.Collections.TagsFollow();
            c.fetch();
            return new Tatami.Views.TagsList({
                collection: c
            });
        },

        tagsRecommended : function(){
            var c = new Tatami.Collections.TagsRecommended();
            c.fetch();
            return new Tatami.Views.TagsList({
                collection: c
            });
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
                collection: new Tatami.Collections.Groups(Tatami.app.groups.where({archivedGroup: false}))
            });

            return groups;
        },
        whoToFollow: function(){
            var c = new Tatami.Collections.WhoToFollow();
            c.fetch();
            return new Tatami.Views.WhoToFollow({
                collection: c
            });
        },

        usersRecommended: function(){
            var c = new Tatami.Collections.WhoToFollow();
            c.fetch();
            return  new Tatami.Views.UserList({
                collection: c
            });
        }
    };

})(Backbone, _, Tatami);