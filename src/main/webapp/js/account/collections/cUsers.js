

//(function(Backbone, Tatami){
/*var CUsers = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/users',
            recommended: '/tatami/rest/users/suggestions',
            search: '/tatami/rest/search/users'
        };
    },

    recommended: function(){
        this.url = this.options.url.recommended;
        this.parse = function(users){
            return users.map(function(user){
                user.followed = false;
                user.avatar = (_.isEmpty(user.avatar))? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned + "/" + username + "/friends";
        this.parse = function(users){
            return users.map(function(user){
                user.followed = true;
                user.avatar = (_.isEmpty(user.avatar))? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch();
    },

    search: function(query){
        this.url = this.options.url.search;
        this.parse = function(users){
            return users.map(function(user){
                user.avatar = (_.isEmpty(user.avatar))? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch({
            data: {
                q: query
            }
        });

    }
});
//})(Backbone, Tatami);*/