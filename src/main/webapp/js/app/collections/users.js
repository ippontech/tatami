(function(Backbone, Tatami){

    var Users = Backbone.Collection.extend({
        model: Tatami.Models.User
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
          return '/tatami/rest/users/suggestions';
        }
    });

    var UsersInGroup = Users.extend({
        url: function(){
            return '/tatami/rest/groups/' + this.group + '/members/';
        }
    });

    var AllUsers = Users.extend({
        url: function(){
            return '/tatami/rest/users/search';
        }
    });



    Tatami.Collections.Users = Users;
    Tatami.Collections.Friends = Friends;
    Tatami.Collections.Followers = Followers;
    Tatami.Collections.WhoToFollow = WhoToFollow;
    Tatami.Collections.UsersInGroup = UsersInGroup;
    Tatami.Collections.AllUsers = AllUsers;

})(Backbone, Tatami);