
_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

var app;

if(!window.app){
  app = window.app = _.extend({
    views: {},
    View: {},
    Collection: {},
    Model: {},
    Router: {},

    Status: {
      statuses: [],
      favorite: function(id){
        _.each(this.statuses,function(status){
          if(status.get('statusId') === id){
            status.set('favorite', !status.get('favorite'));
          }
        });
      },
      destroy: function(id){
        _.each(this.statuses,function(status){
          if(status.get('statusId') === id){
            status.destroy();
          }
        });
      }
    }
  }, Backbone.Events);
}
else {
  app = window.app;
}


/*
  Timeline
*/

app.Collection.StatusCollection = Backbone.Collection.extend({
});

app.Model.StatusUpdateModel = Backbone.Model.extend({
  url : '/tatami/rest/statuses/update'
});

app.Model.StatusDelete = Backbone.Model.extend({
  url: function(){
    return '/tatami/rest/statuses/destroy/' + this.model.get('statusId');
  },
  initialize: function(model) {
    this.model = model;
  }
});

app.Model.StatusAddFavorite = Backbone.Model.extend({
  url: function(){
    return '/tatami/rest/favorites/create/' + this.model.get('statusId');
  },
  initialize: function(model) {
    this.model = model;
  }
});

app.Model.StatusRemoveFavorite = Backbone.Model.extend({
  url: function(){
    return '/tatami/rest/favorites/destroy/' + this.model.get('statusId');
  },
  initialize: function(model) {
    this.model = model;
  }
});

app.View.TimeLineItemView = Backbone.View.extend({
  template: _.template($('#timeline-item').html()),

  initialize: function() {
    if(app.Status.statuses.indexOf(this.model) === -1)
      app.Status.statuses.push(this.model);

    this.model.bind('destroy', this.remove, this);
    this.model.bind('change', this.render, this);
  },

  events: {
    'click .status-action-reply': 'replyAction',
    'click .status-action-share': 'shareAction',
    'click .status-action-favorite': 'favoriteAction',
    'click .status-action-remove': 'removeAction'
  },

  replyAction: function() {

  },

  shareAction: function() {

  },

  favoriteAction: function() {
    var self = this;
    var sd;
    if(this.model.get('favorite') === true)
      sd = new app.Model.StatusRemoveFavorite(this.model);
    else
      sd = new app.Model.StatusAddFavorite(this.model);

    sd.save(null, {
      success: function(){
        var statusId = self.model.get('statusId');
        app.Status.favorite(statusId);
        $(".status-" + statusId).effect("highlight", {color: '#08C'}, 500);
      }
    });
  },

  removeAction: function() {
    if(window.confirm($('#status-delete-popup').html().trim())){
      var self = this;
      var sd = new app.Model.StatusDelete(this.model);

      sd.save(null, {
        success: function(){
          app.trigger('refreshProfile');
          app.Status.destroy(self.model.get('statusId'));
        }
      });
    }
  },

  render: function() {

    $(this.el).html(this.template({status:this.model.toJSON()}));
    $(this.el).tagLinker('.status-content').usernameLinker('.status-content');
    return $(this.el);
  }
});

app.View.TimeLineView = Backbone.View.extend({
  initialize: function() {
    var self = this;

    this.model.bind('reset', this.render, this);
    this.model.bind('add', function(model, collection, options) {
      self.addItem(model, options.index);
    }, this);
  },

  render: function() {
    $(this.el).empty();
    _.each(this.model.models, this.addItem, this);
    return $(this.el);
  },

  addItem: function(item, index) {
    var el = new app.View.TimeLineItemView({
      model: item
    }).render();
    if(index === 0)
      $(this.el).prepend(el);
    else
      $(this.el).append(el);
  }
});

/*
Friendship
*/
app.Model.FollowModel = Backbone.Model.extend({
url : function(){
  return '/tatami/rest/friendships/create';
}
});

app.Model.UnFollowModel = Backbone.Model.extend({
url : function(){
  return '/tatami/rest/friendships/destroy';
}
});

app.View.FollowButtonView = Backbone.View.extend({
templateFollow: _.template($('#follow-button').html()),
templateFollowed: _.template($('#followed-button').html()),

initialize: function() {
  this.set(this.options.owner, this.options.followed);
},

set: function(owner, followed) {
  if(owner)
    this.events = {};
  else if(!owner && followed) {
    this.events = {
      "click .btn": "unfollow"
    };
    this.followedRender();
  }
  else if(!owner && !followed) {
    this.events = {
      "click .btn": "follow"
    };
    this.followRender();
  }
},

follow: function() {
  var self = this;
  this.undelegateEvents();
  $(this.el).empty();

  var m = new app.Model.FollowModel();
  m.set('username', this.options.username);

  m.save(null, {
    success: function(){
      self.set(owner, true);
      self.delegateEvents();
    },
    error: function(){
      self.set(owner, false);
      self.delegateEvents();
    }
  });
},

unfollow: function() {
  var self = this;
  this.undelegateEvents();
  $(this.el).empty();

  var m = new app.Model.UnFollowModel();
  m.set('username', this.options.username);

  m.save(null, {
    success: function(){
      self.set(owner, false);
      self.delegateEvents();
    },
    error: function(){
      self.set(owner, true);
      self.delegateEvents();
    }
  });
},

followRender: function() {
  $(this.el).html(this.templateFollow());
},

followedRender: function() {
  $(this.el).html(this.templateFollowed());
},

unfollowRender: function() {
  $(this.el).html(this.templateUnFollow());
},

render: function() {
  return $(this.el);
}

});

/*
Initialization
*/

  /*
    Search form in the top menu.
  */

app.View.SearchFormHeaderView = Backbone.View.extend({
  initialize: function(){
  },

  events: {
    'submit' : 'submit'
  },

  submit: function(e) {
    e.preventDefault();

    var search = null;

    _.each($(e.target).serializeArray(), function(input){
      if(input.name === 'search')
        search = input.value;
    });
    if(search)
      window.location = '/tatami/#/search/' + search;
  }
});

$(function() {

  app.views.searchFromHeaderView = new app.View.SearchFormHeaderView({
    el: $('#searchHeader')
  });

});