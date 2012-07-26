
$(function() {

  _.templateSettings = {
      interpolate: /\<\@\=(.+?)\@\>/gim,
      evaluate: /\<\@(.+?)\@\>/gim
  };

  var app;

  if(!window.app){
    var app = window.app = _.extend({
      views: {},
      View: {},
      Collection: {},
      Model: {},
      Router: {}
    }, Backbone.Events);
  }
  else {
    app = window.app;
  }


  /*
    Timeline
  */

  var StatusCollection = app.Collection.StatusCollection;

  var StatusUpdateModel = app.Model.StatusUpdateModel;

  var StatusDelete = app.Model.StatusDelete;

  var StatusAddFavorite = app.Model.StatusAddFavorite;

  var StatusRemoveFavorite = app.Model.StatusRemoveFavorite;

  var TimeLineItemView = app.View.TimeLineItemView;

  var TimeLineView = app.View.TimeLineView;


  var ProfileUpdateView = app.View.ProfileUpdateView = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#profile-update').html()),

    initialize: function() {
      $(this.el).addClass('row-fluid');
    },

    events: {
      'submit': 'addStatus'
    },

    addStatus: function(e) {
      var self = this;
      e.preventDefault();

      var status = new StatusUpdateModel();

      _.each($(e.target).serializeArray(), function(value){
        status.set(value.name, value.value);
      });

      status.save(null,{
        success: function(model, response) {
          e.target.reset();
          $(self.el).find('.control-group').removeClass('error');

          app.trigger('refreshProfile');
          app.trigger('refreshTimeline');
        },
        error: function(model, response) {
          $(self.el).find('.control-group').addClass('error');
        }
      });
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template());
      return $(this.el);
    }
  });
  /*
    Status
  */
  var StatusNewView = app.View.StatusNewView = Backbone.View.extend({
    template: _.template($('#timeline-new').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
    },

    events: {
      'click': 'newStatus'
    },

    newStatus: function(done, context){
      this.progress();
      var self = this;
      if(this.model.models.length === 0)
        this.model.fetch({
          data: {
            screen_name: self.model.options.username
          },
          success: function(){
            self.render();
          },
          error: function() {
            self.render();
          }
        });
      else{
        var sc = _.clone(this.model);
        sc.fetch({
          data: {
            since_id: _.first(self.model.models).get('statusId'),
            screen_name: self.model.options.username
          },
          success: function(){
            sc.models.reverse()
            _.each(sc.models, function(model, key) {
              self.model.unshift(model);
            });
            self.render();
          },
          error: function() {
            self.render();
          }
        });
      }
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template());
      this.delegateEvents();
      return $(this.el);
    },

    progress: function() {
      $(this.el).html(this.progressTemplate());
      this.undelegateEvents();
      return $(this.el);
    }

  });

  var StatusNextView = app.View.StatusNextView = Backbone.View.extend({
    template: _.template($('#timeline-next').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
      $(this.el).infinitiScroll();
    },

    events: {
      'click': 'nextStatus'
    },

    nextStatus: function(done, context){
      this.progress();
      var self = this;
      if(this.model.models.length === 0)
        this.model.fetch({
          data: {
            screen_name: self.model.options.username
          },
          success: function(){
            if(self.model.models.length > 0)
              self.render();
            else
              self.remove();
          },
          error: function() {
            self.render();
          }
        });
      else{
        var sc = _.clone(this.model);
        sc.fetch({
          data: {
            max_id: _.last(self.model.models).get('statusId'),
            screen_name: self.model.options.username
          },
          success: function(){
            _.each(sc.models, function(model, key) {
              self.model.push(model);
            });
            if(sc.length > 0)
              self.render();
            else
              self.remove();
          },
          error: function() {
            self.render();
          }
        });
      }
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template());
      this.delegateEvents();
      return $(this.el);
    },

    progress: function() {
      $(this.el).html(this.progressTemplate());
      this.undelegateEvents();
      return $(this.el);
    }

  });

  var StatusListView = app.View.StatusListView = Backbone.View.extend({
    initialize: function() {
      this.model.options = { username : this.options.username };
      this.views = {};

      this.views.new = new StatusNewView({
        model: this.model
      });
      this.views.list = new TimeLineView({
        model: this.model
      });
      this.views.next = new StatusNextView({
        model: this.model
      });

      this.views.next.nextStatus();

      this.on('new', this.views.new.newStatus, this.views.new);
      this.on('next', this.views.next.nextStatus, this.views.next);
    },

    render: function() {

      $(this.el).empty();
      $(this.el).append(this.views.new.render());
      $(this.el).append(this.views.list.$el);
      $(this.el).append(this.views.next.render());
      return $(this.el);
    }
  });

  /*
    Friendship
  */

  var FollowModel = app.Model.FollowModel;
  var UnFollowModel = app.Model.UnFollowModel;

  var FollowButtonView = app.View.FollowButtonView;

  /*
    Followers & Followed

    /rest/followers/lookup
    /rest/friends/lookup
  */

  var UserModel = app.Model.UserModel = Backbone.Model.extend({
  });

  var FollowersCollection = app.Collection.FollowersCollection = Backbone.Collection.extend({
    url : function(){
      return '/tatami/rest/followers/lookup';
    }
  });

  var FollowedCollection = app.Collection.FollowedCollection = Backbone.Collection.extend({
    url : function(){
      return '/tatami/rest/friends/lookup';
    }
  });

  var UserItemView = app.View.UserItemView = Backbone.View.extend({
    template: _.template($('#user-item').html()),

    initialize: function() {
      
    },
    render: function() {
      var $el = $(this.el);
      $el.html(this.template({user:this.model.toJSON()}));
      return $(this.el);
    }
  });


  var UserListView = app.View.UserListView = Backbone.View.extend({
    initialize: function() {
      var self = this;

      this.model.bind('reset', this.render, this);
      this.model.bind('add', function(model, collection, options) {
        self.addItem(model, options.index);
      }, this);

      this.model.fetch({
        data: {
          screen_name: this.options.username
        }
      });
    },

    render: function() {
      $(this.el).empty();
      _.each(this.model.models, this.addItem, this);
      return $(this.el);
    },

    addItem: function(item, index) {
      var el = new UserItemView({
        model: item
      }).render();
      if(index === 0)
        $(this.el).prepend(el);
      else
        $(this.el).append(el);
    }
  });

  /*
    Status
  */

  var StatusModel = app.Model.StatusModel = Backbone.Model.extend({
  });

  var StatusView = app.View.StatusView = Backbone.View.extend({

    initialize: function() {
      this.views = {};

      this.model = new StatusModel();
      this.model.url = "/tatami/rest/statuses/show/" + this.options.idstatus;

      this.views.item = new TimeLineItemView({
        model : this.model
      });
      
      this.model.fetch();
    },
    render: function() {
      $(this.el).html(this.views.item.render());
      return $(this.el);
    }
  });



  /*
    Initialisation
  */

  var ProfileRouter = app.Router.ProfileRouter = Backbone.Router.extend({

    initialize: function() {
      app.views.followButton = new FollowButtonView({
        username: username,
        followed: followed,
        owner: owner
      });
      app.views.update = new ProfileUpdateView();
      $('#follow-action').html(app.views.followButton.render());
      $('#div-update').html(app.views.update.render());
    },

    selectMenu: function(menu) {
      $('.profilMenu a').parent().removeClass('active');
      $('.profilMenu a[href="#/' + menu + '"]').parent().addClass('active');
    },

    routes: {
      "status": "status",
      "status/:status": "show",
      "followers": "followers",
      "followed": "followed",
      "*action": "status"
    },

    status: function() {
      this.selectMenu('status');
      $('#tab-content').empty();

      if(!app.views.status) {
        var statuscollection = new StatusCollection();
        statuscollection.url = '/tatami/rest/statuses/user_timeline';
        var status = app.views.status = new StatusListView({
          model: statuscollection,
          username : username
        });
      }
      $('#tab-content').html(app.views.status.render());
    },

    followers: function() {
      this.selectMenu('followers');
      var followersCollection = new FollowersCollection();
      var followers = app.views.followers = new UserListView({
        model: followersCollection,
        username : username
      });
      $('#tab-content').html(app.views.followers.render());
    },

    followed: function() {
      this.selectMenu('followed');
      $('#tab-content').empty();
      var followedCollection = new FollowedCollection();
      var followed = app.views.followed = new UserListView({
        model: followedCollection,
        username : username
      });
      $('#tab-content').html(app.views.followed.render());
    },

    show: function(status) {
      this.selectMenu('show');
      $('#tab-content').empty();
      var showStatus = app.views.showStatus = new StatusView({
        idstatus: status
      });
      $('#tab-content').html(app.views.showStatus.render());
    }
  });

  app.router = new ProfileRouter();
  Backbone.history.start();


});