(function(Backbone, _, Tatami){

    var users = new (Backbone.Collection.extend({
        model : Tatami.Models.Users
    }))();

    Tatami.Factories.Profile = {
        profileSide: function(username){
            return new Tatami.Views.ProfileSide();

        },
/*
        actions: {
                selector: ".actions-profile"
            },
            tagTrends: {
                selector: ".tag-trends"
            },
            stats: {
                selector: ".stats"
            },
            informations: {
                selector: ".informations"
            }*/

        actions: function(username){
            var user = this.getUsers(username);

        },

        tagTrends: function(username){
            var user = this.getUsers(username);

        },

        stats: function(username){
            var user = this.getUsers(username);

            return new Tatami.Views.ProfileStats({
                model: user
            });
        },

        informations: function(username){
            var user = this.getUsers(username);

        },

        profileBody: function(username){
            return new Tatami.Views.ProfileBody();
        },
        profileHeader: function(username){
            var user = this.getUsers(username);

            return new Tatami.Views.ProfileHeader({
                model: user
            });
        },

        getUsers: function(username){
            var user = users.get(username);
            if(!user){
                user = new Tatami.Models.Users({
                    username: username
                });
                users.add(user);
                user.fetch();
            }

            return user;
        },

        statuses: function(username){
            var c = new Tatami.Collections.StatusesUsers();
            c.user = username;

            return new Tatami.Views.Statuses({
                collection: c
            });
        }
    };

})(Backbone, _, Tatami);