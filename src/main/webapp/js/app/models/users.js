(function(Backbone, _, Tatami, Modernizr, window){

  var Users = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      Tatami.app.on('localstorage:users', function(model){
        if(self !== model && self.id === model.id) {
          self.set(model.toJSON());
        }
      });
      this.on('sync', function(model){
        model.saveToLocal();
      });
      this.fetch();
    },

    sync: function(method, model, options) {
      if((method === 'read' || method === 'update' || method === 'patch') && model.id) model.fetchFromLocal();
      Backbone.sync(method, model, options);
    },

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

    fetchFromLocal: function(){
      if (Modernizr.localstorage) {
        var resp = window.localStorage.getItem('users:' + this.id);
        try {
          this.set(JSON.parse(resp));
        }
        catch(e) {
        }
      }
      return this;
    },

    saveToLocal: function(){
      if (Modernizr.localstorage) {
        window.localStorage.setItem('users:' + this.id, JSON.stringify(this));
        Tatami.app.trigger('localstorage:users', this);
      }
      return this;
    },

    fetch: function() {
      this.fetchFromLocal();
      return Backbone.Model.prototype.fetch.call(this);
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