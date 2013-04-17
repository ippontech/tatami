(function(Backbone, _, Tatami, Modernizr, window){

  var Users = Backbone.Model.extend({
    idAttribute: 'username',

    defaults: {
      gravatar: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      attachementsSize: 0,
      friendsCount: 0,
      followersCount: 0
    },

    urlRoot: '/tatami/rest/users/',

    toJSON: function(){
      var attr = Backbone.Model.prototype.toJSON.call(this);

      attr.fullName = this.getFullName();

      return attr;
    },

    getFullName: function(){
      var fullName = [];

      if (this.get('firstName')) fullName.push(this.get('firstName'));
      if (this.get('lastName')) fullName.push(this.get('lastName'));

      return fullName.join(' ');
    }
  });

  /*
  Users.getUser = function(username){
    
  };*/

  Tatami.Models.Users = Users;

})(Backbone, _, Tatami, Modernizr, window);