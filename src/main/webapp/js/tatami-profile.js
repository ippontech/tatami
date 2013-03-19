
_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

var app;

if(!window.app){
  app = window.app = _.extend({
    views: {},
    collections: {},
    View: {},
    Collection: {},
    Model: {},
    Router: {}
  }, Backbone.Events);
}
else {
  app = window.app;
}

app.Collection.TrendsCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/user/trends?screen_name=' + username;
    }
});

/*
  Timeline
*/

app.View.ProfileUpdateView = Backbone.View.extend({
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
    this.disable();

    var status = new app.Model.StatusUpdateModel();

    _.each($(e.target).serializeArray(), function(value){
      status.set(value.name, value.value);
    });

    status.save(null,{
      success: function(model, response) {
          e.target.reset();
          $(self.el).find('.control-group').removeClass('error');

          $("#updateStatusContent").css("height", "20px");
          $("#updateStatusBtn").hide();
          $("#statusUpdate").popover({placement: 'bottom'});
          $("#statusUpdate").popover('show');
          $("#updateStatusContent").change();
          setTimeout(function () {
              $("#updateStatusBtn").popover('hide');
          }, 3000);
          self.enable();
      },
      error: function(model, response) {
        $(self.el).find('.control-group').addClass('error');
        self.enable();
      }
    });
  },

  disable : function(){
    this.$el.find('[type="submit"]').attr('disabled', 'disabled');
  },

  enable : function(){
    this.$el.find('[type="submit"]').removeAttr('disabled');
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template());
    return $(this.el);
  }
});

/*
  Followers & Followed

  /rest/followers/lookup
  /rest/friends/lookup
*/

app.Model.UserModel = Backbone.Model.extend({
});

app.Collection.FollowersCollection = Backbone.Collection.extend({
  url : function(){
    return '/tatami/rest/followers/lookup';
  }
});

app.Collection.FollowedCollection = Backbone.Collection.extend({
  url : function(){
    return '/tatami/rest/friends/lookup';
  }
});

app.View.UserItemView = Backbone.View.extend({
  template: _.template($('#user-item').html()),

  initialize: function() {
    
  },
  render: function() {
    var $el = $(this.el);
    $el.html(this.template({user:this.model.toJSON()}));
    return $(this.el);
  }
});

app.View.UserListView = Backbone.View.extend({
  initialize: function() {
    var self = this;

    this.model.bind('reset', this.render, this);
    this.model.bind('add', function(model, collection, options) {
      self.addItem(model, collection.indexOf(model));
    }, this);

    this.model.fetch({
      data: {
        screen_name: this.options.username
      }
    });
  },

  render: function() {
    $(this.el).empty();
    this.model.forEach(this.addItem, this);
    return $(this.el);
  },

  addItem: function(item, index) {
    var el = new app.View.UserItemView({
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

app.View.StatusView = Backbone.View.extend({

  initialize: function() {
    this.views = {};

    this.model = new app.Model.Status();
    this.model.url = "/tatami/rest/statuses/show/" + this.options.idstatus;

    var self = this;
    this.model.fetch({
      success: function(model){
        self.views.item = new app.View.TimeLineItemView({
          model : model
        });
        self.render();

        self.views.item.detailsAction();
      }
    });
  },
  render: function() {
    $(this.el).html(this.views.item.render());
    return $(this.el);
  }
});

/* Add template when a user follows you */
app.View.isFollowMe = Backbone.View.extend({
    template: _.template($('#user-follow-me').html()),

    initialize: function(){
        this.isfollowMe();
    },

    isfollowMe: function(){

        _this = this;
        return $.get('/tatami/rest/followers/lookup', {screen_name:this.options.authenticateUser}, function (data) {

            for(var i in data){
                if(data[i].username === _this.options.currrentUser){
                    $(_this.el).append(_this.template());
                }
            }

        });
    },

    render: function(){
        return $(this.el);
    }

});

app.View.ProfileStatsView = Backbone.View.extend({
  template: _.template($('#profile-stats-template').html()),

  initialize: function() {
    this.model.bind('change', this.render, this);
    app.on('refreshProfile', this.model.fetch, this.model);
  },

  render: function() {
    this.$el.html(this.template({profile:this.model.toJSON()}));
    return this.$el;
  }
});

/*
  Initialization
*/
app.Router.ProfileRouter = Backbone.Router.extend({

  initialize: function() {
    app.views.followButton = new app.View.FollowButtonView({
      username: username,
      followed: followed,
      owner: owner
    });

    app.views.isfollowMe = new app.View.isFollowMe({
      authenticateUser: authenticatedUsername,
      currrentUser : username
    });

    app.views.stats = new app.View.ProfileStatsView({
      el : $('.profile-infos'),
      model : new app.Model.ProfileModel()
    });

    app.views.update = new app.View.ProfileUpdateView();
    $('#is-follow-you').html(app.views.isfollowMe.render());
    $('#follow-action').html(app.views.followButton.render());
    $('#div-update').html(app.views.update.render());
      $("#updateStatusContent").focus(function () {
          $(this).css("height", "200px");
          $("#updateStatusBtn").fadeIn();
      });

      $("#updateStatusContent").typeahead(new Suggester($("#updateStatusContent")));

      $("#fullSearchText").typeahead(new SearchEngine($("#fullSearchText")));

      $("#updateStatusContent").charCount({
          css: 'counter',
          cssWarning: 'counter_warning',
          cssExceeded: 'counter_exceeded',
          allowed: 750,
          warning: 50,
          counterText: text_characters_left + " "
      });

      $("#updateStatusBtn").popover({
          animation: true,
          placement: 'bottom',
          trigger: 'manual'
      });
      jQuery("abbr.timeago").timeago();
      var trends = new app.View.TrendsView();
      $('#trends').html(trends.render());
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
    $('#accountContent').empty();

    if(!app.views.status) {
      var statuscollection = new app.Collection.StatusCollection();
      statuscollection.url = '/tatami/rest/statuses/' + username + '/timeline';
      app.views.status = new app.View.TimeLinePanelView({
        model: statuscollection
      });
    }
    $('#tab-content').html(app.views.status.render());
  },

  followers: function() {
    this.selectMenu('followers');
    var followersCollection = new app.Collection.FollowersCollection();
    app.views.followers = new app.View.UserListView({
      model: followersCollection,
      username : username
    });
    $('#tab-content').html(app.views.followers.render());
  },

  followed: function() {
    this.selectMenu('followed');
    $('#tab-content').empty();
    var followedCollection = new app.Collection.FollowedCollection();
    app.views.followed = new app.View.UserListView({
      model: followedCollection,
      username : username
    });
    $('#tab-content').html(app.views.followed.render());
  },

  show: function(status) {
    this.selectMenu('show');
    $('#tab-content').empty();
    app.views.showStatus = new app.View.StatusView({
      idstatus: status
    });
    $('#tab-content').html(app.views.showStatus.$el);
  }
});

$(function() {

  app.router = new app.Router.ProfileRouter();
  Backbone.history.start();

});