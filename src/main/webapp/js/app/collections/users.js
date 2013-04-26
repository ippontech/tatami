(function(Backbone, Tatami){

    var Users = Backbone.Collection.extend({
        model: Tatami.Models.Users
    });

    var Friends = Users.extend({
        url: function(){
          return '/tatami/rest/users/' + this.user + '/friends';
        }
    });

    var Followers = Users.extend({
        url: function(){
          return '/tatami/rest/users/' + this.user + '/followers';
        }
    });

    var WhoToFollow = Users.extend({
        url: function(){
          //return '/tatami/rest/users/suggestions';
          return '/tatami/rest/users/' + username + '/friends';
        }
    });

    Tatami.Collections.Users = Users;
    Tatami.Collections.Friends = Friends;
    Tatami.Collections.Followers = Followers;
    Tatami.Collections.WhoToFollow = WhoToFollow;

})(Backbone, Tatami);