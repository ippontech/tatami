(function(Backbone, Tatami){

    var Users = Backbone.Collection.extend({
        model: Tatami.Models.User
    });

    var UsersInGroup = Backbone.Collection.extend({
        model: Tatami.Models.UserGroup,

        url: function(){
            return '/tatami/rest/groups/' + this.group + '/members/';
        }
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

    var SearchUsers = Users.extend({
        url: function(){
            return '/tatami/rest/search/users';
        }
    });



    Tatami.Collections.Users = Users;
    Tatami.Collections.Friends = Friends;
    Tatami.Collections.Followers = Followers;
    Tatami.Collections.WhoToFollow = WhoToFollow;
    Tatami.Collections.UsersInGroup = UsersInGroup;
    Tatami.Collections.SearchUsers = SearchUsers;

})(Backbone, Tatami);