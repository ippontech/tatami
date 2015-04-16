(function(Backbone, _, Tatami){

    var users = new (Backbone.Collection.extend({
        model : Tatami.Models.User
    }))();

    Tatami.Factories.Profile = {
        profileSide: function(username){
            return new Tatami.Views.ProfileSide();

        },

        actions: function(username){
            var user = this.getUsers(username);

        },

        tagTrends: function(username){
            return Tatami.Factories.Home.tagTrends(username);
        },

        stats: function(username){
            var user = this.getUsers(username);

            return new Tatami.Views.ProfileStats({
                model: user
            });
        },

        informations: function(username){
            var user = this.getUsers(username);

            return new Tatami.Views.ProfileInformations({
                model: user
            });
        },

        profileBody: function(username){
            return new Tatami.Views.ProfileBody({
                user: username
            });
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
                user = new Tatami.Models.User({
                    username: username
                });
                users.add(user);
                user.fetch({
                    error: function(){
                        Tatami.app.router.defaults();
                    }
                });
            }

            return user;
        },

        statuses: function(username){
            var c = new Tatami.Collections.StatusesUsers();
            c.user = username;

            return new Tatami.Views.Statuses({
                collection: c
            });
        },

        friends: function(username){
            var c = new Tatami.Collections.Friends();
            c.user = username;
            c.fetch();
            return  new Tatami.Views.UserList({
                collection: c,
                itemViewOptions:{desactivable:true}
            });
        },

        followers: function(username){
            var c = new Tatami.Collections.Followers();
            c.user = username;
            return  new Tatami.Views.UserList({
                collection: c
            });
        }
    };

})(Backbone, _, Tatami);