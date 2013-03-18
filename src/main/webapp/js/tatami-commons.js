var patterns = {
	login: /(^|[^\w])@[\w]*$/gim,
	hash: /(^|[^\w])#[\w]*$/gim,
    char: /([a-zA-Z]+)/
};

_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

marked.setOptions({
    gfm: true,
    pedantic: false,
    sanitize: true,
    highlight: null,
    urls: {
      youtube : function(text, url){
        var cap;
        if((cap = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/.exec(url))){
          return '<iframe width="420" height="315" src="http://www.youtube.com/embed/' +
          cap[5] +
          '" frameborder="0" allowfullscreen></iframe>';
        }
      },
      vimeo : function(text, url){
        var cap;
        if((cap = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.exec(url))){
          return '<iframe src="http://player.vimeo.com/video/' +
          cap[5] +
          '" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        }
      },
      dailymotion : function(text, url){
        var cap;
        if((cap = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/.exec(url))){
          return '<iframe frameborder="0" width="480" height="271" src="http://www.dailymotion.com/embed/video/' +
          cap[2] +
          '"></iframe>';
        }
      },
      gist : function(text, url){
        var cap;
        if((cap = /^.+gist.github.com\/(([A-z0-9-]+)\/)?([0-9A-z]+)/.exec(url))){
          $.ajax({
            url: cap[0] + '.json',
            dataType: 'jsonp',
            success: function(response){
              if(response.stylesheet && $('link[href="' + response.stylesheet + '"]').length === 0){
                var l = document.createElement("link"),
                  head = document.getElementsByTagName("head")[0];

                l.type = "text/css";
                l.rel = "stylesheet";
                l.href = response.stylesheet;
                head.insertBefore(l, head.firstChild);
              }
              var $elements = $('.gist' + cap[3]);
              $elements.html(response.div);
            }
          });
          return '<div class="gist' + cap[3] + '"/>';
        }
      }
    }
});

$.fn.typeahead.Constructor.prototype.show  =function () {
  var pos = $.extend({}, this.$element.position(), {
    height: this.$element[0].offsetHeight
  });

  var padding = parseInt( this.$element.css('padding-left'), 10 );

  this.$menu
    .insertAfter(this.$element)
    .css({
      top: pos.top + pos.height,
      left: pos.left + padding
    })
    .show();

  this.shown = true;

  this.$menu.css('min-width', this.$element.width() + 'px' );

  return this;
};

var app = window.app = _.extend({
        views:{},
        collections: {},
        View:{},
        Collection:{},
        Model:{},
        Router:{},

        Status:{
            statuses:[],
            share:function (id) {
                _.each(this.statuses, function (status) {
                    if (status.get('statusId') === id) {
                        status.set('share', !status.get('share'));
                    }
                });
            },
            favorite:function (id) {
                _.each(this.statuses, function (status) {
                    if (status.get('statusId') === id) {
                        status.set('favorite', !status.get('favorite'));
                    }
                });
            },
            destroy:function (id) {
                _.each(this.statuses, function (status) {
                    if (status.get('statusId') === id) {
                        status.destroy();
                    }
                });
            }

    }

  }, Backbone.Events);

/*
  Timeline
*/
app.Model.Status = Backbone.Model.extend({
  initialize: function() {
    var self = this;

    app.Status.statuses.push(self);

    this.bind('destroy', function() {
      app.Status.statuses.shift(self);
    });
  }
});


app.Collection.StatusCollection = Backbone.Collection.extend({
  model: app.Model.Status
});

app.Model.StatusUpdateModel = Backbone.Model.extend({
  url : '/tatami/rest/statuses/update',
  defaults: {
    'attachmentIds': []
  }
});

app.Model.Share = Backbone.Model.extend({
    url: function(){
        return '/tatami/rest/statuses/share/' + this.model.get('statusId');
    },
    initialize: function(model) {
        this.model = model;
    }
});

app.Model.Discussion = Backbone.Model.extend({
    url:  '/tatami/rest/statuses/discussion'
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

app.Model.StatusDetails = Backbone.Model.extend({
    url: function(){
        return '/tatami/rest/statuses/details/' + this.statusId;
    },
    initialize: function(model) {
        this.statusId = model.get('statusId');
    }
});

app.Collection.Discussion = Backbone.Collection.extend({
});

app.Collection.SharesCollection = Backbone.Collection.extend({

});

app.Collection.TrendsCollection = Backbone.Collection.extend({
    url : '/tatami/rest/trends'
});

app.View.SharesView = Backbone.View.extend({
  tagName: 'div',
  template: _.template($('#timeline-share').html()),

  render: function() {
    var self = this;
    if (this.model.size() > 0) {
      this.$el.html(this.template({count:this.model.size()}));
      this.model.forEach(function(model) {
        self.$el.find('.shares-list').append(new app.View.ShareView({username: model.get('username')}).render());
      });
    }
    else
      this.$el.empty();
    return this.$el;
  }
});

app.Model.ShareProfileModel = Backbone.Model.extend({
  url : function(){
    return '/tatami/rest/users/show?screen_name=' + this.options.username;
  }
});

app.View.ShareView = Backbone.View.extend({
  template: _.template($('#timeline-share-item').html()),
  initialize: function(){
    var self = this;
    var profile = new app.Model.ShareProfileModel();
    profile.options = { username: this.options.username };
    profile.fetch({
      success: function(model){
        self.model = model;
        self.render();
      }
    });
  },
  render: function(){
    this.$el.html(this.template({
      username: this.options.username,
      profile: ((typeof this.model !== 'undefined') ? this.model.toJSON() : null)
    }));
    return this.$el;
  }
});

/* Views */

app.View.TrendsView = Backbone.View.extend({
    template: _.template($('#trends-template').html()),
    tagName: 'ul',

    initialize: function() {
        var self = this;

        this.model = new app.Collection.TrendsCollection();

        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection) {
            self.addItem(model, collection.indexOf(model));
        }, this);

        this.model.fetch();
    },

    render: function() {
        $(this.el).empty();
        if(this.model.length > 0)
            this.model.forEach(this.addItem, this);
        else
            $(this.el).html(this.template());
        return $(this.el);
    },

    addItem: function(item, index) {
        var el = new app.View.TrendsItemView({
            model: item
        }).render();
        if(index === 0)
            $(this.el).prepend(el);
        else
            $(this.el).append(el);
    }
});

app.View.TrendsItemView = Backbone.View.extend({
    //tagName: 'tr',
    template: _.template($('#trends-template-item').html()),


    initialize: function() {
    },

    render: function() {
        var $el = $(this.el);
        $el.html(this.template({trend:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.TimeLineItemView = Backbone.View.extend({
  template: _.template($('#timeline-item').html()),

  initialize: function() {
    this.views = {};
    this.views.status = new app.View.TimeLineItemInnerView({
      model : this.model,
      discuss : this.options.discuss
    });

    this.model.bind('change', this.refreshFavorite, this);
    this.model.bind('destroy', this.remove, this);

    this.views.status.bind('details', this.detailsAction, this);
    this.views.status.bind('highlight', this.highlight, this);
    this.views.status.bind('sharePopover', this.sharePopover, this);
  },

  refreshFavorite: function() {
    if(this.model.get('favorite') === true)
      this.$el.find(':first').addClass('favorite');
    else
      this.$el.find(':first').removeClass('favorite');
  },

  highlight: function() {
    this.$el.find('.status').effect("highlight", {color:'#08C'}, 500);
  },

    sharePopover: function() {
        var shareBtn = this.$el.find('.status-action-share');

        shareBtn.popover({
            animation: true,
            placement: 'bottom',
            trigger: 'manual',
            content: ''
        });
        shareBtn.popover('show');
        setTimeout(function () {
            shareBtn.popover('hide');
        }, 3000);
    },

  detailsAction:function () {
    var statusId = this.model.get('statusId');
    var self = this;

    if (this.details !== true) {
      var statusDetails = new app.Model.StatusDetails(this.model);


      if(typeof this.views.discussCurrent === 'undefined'){
        this.views.discussCurrent = new app.View.TimeLineView({
          model: new app.Collection.StatusCollection(),
          discuss: true
        });
      }
      if(typeof this.views.discussBefore === 'undefined'){
        this.views.discussBefore = new app.View.TimeLineView({
          model: new app.Collection.StatusCollection(),
          discuss: true
        });
      }
      if(typeof this.views.discussAfter === 'undefined'){
        this.views.discussAfter = new app.View.TimeLineView({
          model: new app.Collection.StatusCollection(),
          discuss: true
        });
      }
      if(typeof this.views.shares === 'undefined'){
        this.views.shares = new app.View.SharesView({
          model: new app.Collection.SharesCollection()
        });
      }
      statusDetails.fetch({
        success: function(model){
          self.views.discussCurrent.model.reset();
          self.views.discussBefore.model.reset();
          self.views.discussAfter.model.reset();

          var discussionIsPresent = false;
          _.forEach(model.get('discussionStatuses'),function(model, index, collection){
            var initDate = self.model.get('statusDate');
            if (model.statusDate < initDate){
              self.views.discussBefore.model.add(model);
            }
            else {
              self.views.discussAfter.model.add(model);
            }
            discussionIsPresent = true;
          });
          if(discussionIsPresent) {
          self.views.discussCurrent.model.add(self.model);
          }
          self.views.shares.model.reset();
          _.forEach(model.get('sharedByLogins'), function(value) {
            var username = value.split('@')[0];
            self.views.shares.model.add({username:username});
          });
          self.views.shares.render();
        }
      });
    }

    this.details = !this.details;

    this.detailsRender();

    this.highlight();
  },

    detailsRender:function () {
        if (this.details) {
            this.$el.find('.discuss-current').append(this.views.discussCurrent.render());
            this.$el.find('.discuss-before').append(this.views.discussBefore.render());
            this.$el.find('.discuss-after').append(this.views.discussAfter.render());
            this.$el.find('.shares').append(this.views.shares.render());
        } else {
            this.$el.find('.discuss-current').empty();
            this.$el.find('.discuss-before').empty();
            this.$el.find('.discuss-after').empty();
            this.$el.find('.shares').empty();
        }
    },

  render: function() {
    $(this.el).html(this.template({
      status:this.model.toJSON(),
      discuss: (this.options.discuss)
    }));
    this.$el.find('.statuses').html(this.views.status.render());
    return $(this.el);
  }
});

app.View.TimeLineItemInnerView = Backbone.View.extend({
  tagName: 'table',
   inSearchMode: false,
   searchChar: '',

  template: _.template($('#timeline-item-inner').html()),

  initialize: function() {
    this.model.bind('change', this.render, this);
  },

  events: {
    'click .status-action-details': 'detailsAction',
    'click .status-action-reply': 'replyAction',
    'click .status-action-share': 'shareAction',
    'click .status-action-favorite': 'favoriteAction',
    'click .status-action-remove': 'removeAction',
    'click .replyEditorTab a[data-toggle="tab"]': 'replyChangeTab',
    'submit .reply-form': 'sendReply'
  },

  replyChangeTab: function(e){
    var a = e.target;
    if(a.hasAttribute('data-pane')){
      var target = a.getAttribute('data-pane');
      this.$el.find('.tab-pane').removeClass('active');
      this.$el.find(target+'.tab-pane').addClass('active');
    }
  },

  detailsAction: function () {
    this.trigger('details');
  },

  replyAction: function() {
    var statusId = this.model.get('statusId');
    this.model.set('discuss', !this.model.get('discuss'));
    this.model.set('replyContent', '');

    this.trigger('highlight');
  },

    shareAction:function () {
        var shareModel = new app.Model.Share(this.model);
        var self = this;
        shareModel.save(null, {
            success:function () {
                var statusId = self.model.get('statusId');
                app.Status.share(statusId);
                self.trigger('highlight');
                self.trigger('sharePopover');
            }
        });
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

  sendReply: function(e) {
    e.preventDefault();
    this.disable();
    var self = this;

    var dm = new app.Model.Discussion({
      statusId: this.model.get('statusId')
    });

    _.each($(e.target).serializeArray(), function(value){
      dm.set(value.name, value.value);
    });

    dm.save(null, {
      success: function(){
        self.replyAction();
        
        app.trigger('refreshProfile');
        app.trigger('refreshTimeline');
        self.enable();
      },
      error: function(){
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
      var self = this;
      var model = this.model.toJSON();
      model.markdown = marked(model.content);

      $(this.el).html(this.template({
          status:model,
          discuss:(this.options.discuss)
      }));

      $('a[data-toggle="tab"][data-pane=".replyPreviewPane"]').on('show', function (e) {
            self.$el.find('.replyPreview').html(
                marked(self.$el.find('.replyEdit').val()));
      });

      $(this.el).find("abbr.timeago").timeago();
      var element = $(this.el).find("textarea.replyEdit");
      $(this.el).find("textarea.replyEdit").typeahead(new Suggester(element));
      return $(this.el);
  }
});

app.View.TimeLineView = Backbone.View.extend({
  initialize: function() {
    var self = this;

    this.model.bind('reset', this.render, this);
    this.model.bind('add', function(model, collection, options) {
      self.addItem(model, collection.indexOf(model));
    }, this);
  },

  render: function() {
    $(this.el).empty();
    this.model.forEach(this.addItem, this);
    return $(this.el);
  },

  addItem: function(item, index) {
    var el = new app.View.TimeLineItemView({
      model: item,
      discuss: this.options.discuss
    }).render();
    if(index === 0) {
      $(this.el).prepend(el);
    } else {
      $(this.el).append(el);
    }
  }
});
/*
  Profile
*/

app.Model.ProfileModel = Backbone.Model.extend({
  defaults: {
    'gravatar': '',
    'firstName': '',
    'lastName': '',
    'statusCount': 0,
    'friendsCount': 0,
    'followersCount': 0
  },
  url : function(){
    return '/tatami/rest/users/show?screen_name=' + username;
  }
});

/*
Friendship
*/
app.Model.FollowUserModel = Backbone.Model.extend({
url : function(){
  return '/tatami/rest/friendships/create';
}
});

app.Model.UnFollowUserModel = Backbone.Model.extend({
url : function(){
  return '/tatami/rest/friendships/destroy';
}
});

app.View.FollowButtonView = Backbone.View.extend({
  templateFollow: _.template($('#follow-button').html()),
  templateFollowed: _.template($('#followed-button').html()),
  templateUserEdit:_.template($('#edit-profile').html()),

initialize: function() {
  this.set(this.options.owner, this.options.followed);
},

set: function(owner, followed) {
  if(owner){
  this.events = {
          "click .btn": "editMyProfile"
      };
    this.editMyProfileRender();
  }
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

editMyProfile: function() {
  window.location = '/tatami/account';
},

follow: function() {
  var self = this;
  this.undelegateEvents();
  $(this.el).empty();

  var m = new app.Model.FollowUserModel();
  m.set('username', this.options.username);

  m.save(null, {
    success: function(){
      self.set(self.options.owner, true);
      self.delegateEvents();
      app.trigger('refreshProfile');
    },
    error: function(){
      self.set(self.options.owner, false);
      self.delegateEvents();
    }
  });
},

unfollow: function() {
  var self = this;
  this.undelegateEvents();
  $(this.el).empty();

  var m = new app.Model.UnFollowUserModel();
  m.set('username', this.options.username);

  m.save(null, {
    success: function(){
      self.set(self.options.owner, false);
      self.delegateEvents();
      app.trigger('refreshProfile');
    },
    error: function(){
      self.set(self.options.owner, true);
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

editMyProfileRender: function() {
  $(this.el).html(this.templateUserEdit());
},

render: function() {
  return $(this.el);
}

});
/*
  Timeline
*/

app.View.TimeLineNewView = Backbone.View.extend({
  template: _.template($('#timeline-new').html()),
  progressTemplate: _.template($('#timeline-progress').html()),

  initialize: function(){
    this.temp = new app.Collection.StatusCollection();

    $(this.el).find("abbr.timeago").timeago();

    this.endRefresh();
  },

  events: {
    'click': 'newStatus'
  },

  startRefresh: function(){
    if(typeof this.options.refresh === 'undefined')
      this.refresh();
    else
      _.defer(this.options.refresh);
  },

  endRefresh: function(){
    this.options.refresh = _.once(_.bind(this.refresh, this));
    _.delay(this.options.refresh, this.options.interval); // this.options.interval
  },

  refresh: function(callback){
    var self = this;

    var sc = this.model.clone();
    sc.off();
    sc.url = this.model.url;

    var data = {};
    if( typeof this.temp.first() !== 'undefined')
      data.since_id = this.temp.first().get('timelineId');
    else if(typeof this.model.first() !== 'undefined')
      data.since_id = this.model.first().get('timelineId');

    sc.fetch({
      data:data,
      success:function (model, response) {
        if(Object.prototype.toString.call( response ) !== '[object Array]' ) {
          // if the answer is not an array, the session must have expired
          $(location).attr('href', '/tatami/login?timeout');
        }
        while (sc.length > 0) {
          self.temp.unshift(sc.pop());
        }
        self.render();

        self.trigger('callbackRefresh');
        self.endRefresh();
      },
      error:function () {
        self.render();
        self.trigger('callbackRefresh');
        self.endRefresh();
      },
      statusCode: {
        302: function() {
          $(location).attr('href', '/tatami/login?timeout');
        }
      }
    });
  },

  newStatus: function() {
    NotificationManager.setAllowNotification();
    this.progress();
    var self = this;
    if (this.model.length === 0) {
      this.model.fetch({
        success:function () {
          self.render();
        },
        error:function () {
          self.render();
        }
      });
    } else {
      var callback = _.once(_.bind(this.newStatusCallback, this));
      this.on('callbackRefresh', callback);
      this.startRefresh();
    }
  },

  newStatusCallback: function(){
    while (this.temp.length > 0)
      this.model.unshift(this.temp.pop());
    this.render();
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template({status: this.temp.length}));
    this.delegateEvents();

    // filter out non-status (disconnection) and statuses from current user
    var statuses =  _.filter(this.temp.models,
          function(s) { return s != undefined && s.attributes.username != undefined && s.attributes.username != username});
    if (statuses.length > 0) {
        // Update Title
      document.title = "Tatami (" + this.temp.length + ")";
      var notificationText = "";
      if (statuses.length == 1) {
        notificationText = "1 unread status";
      } else {
        notificationText = (statuses.length) + " unread statuses";
      }
      NotificationManager.setNotification("Tatami notification", notificationText, true);
    } else {
        document.title = "Tatami";
    }

    return $(this.el);
  },

  progress: function() {
    $(this.el).html(this.progressTemplate());
    this.undelegateEvents();
    return $(this.el);
  }

});

app.View.TimeLineNextView = Backbone.View.extend({
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
    if(this.model.length === 0)
      this.model.fetch({
        success: function(){
          if(self.model.length > 0)
            self.render();
          else
            self.remove();
        },
        error: function() {
          self.render();
        }
      });
    else{
      var sc = this.model.clone();
      sc.off();
      sc.url = this.model.url;

      sc.fetch({
        data: {
          max_id: this.model.last().get('timelineId')
        },
        success: function(){
          sc.forEach(self.model.push, self.model);
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
    this.undelegateEvents(); return $(this.el); }

});

app.View.TimeLinePanelView = Backbone.View.extend({

  initialize: function(){
    this.views = {};
    this.views.timeline = new app.View.TimeLineView({
      model : this.model
    });
    this.views.news = new app.View.TimeLineNewView({
      interval: 20000,
      model : this.model
    });
    this.views.next = new app.View.TimeLineNextView({
      model : this.model
    });

    this.views.next.nextStatus();

    this.on('refresh', this.views.news.newStatus, this.views.news);
    this.on('next', this.views.next.nextStatus, this.views.next);

    app.on('refreshTimeline', this.views.news.newStatus, this.views.news);

    if(this.options.autoRefresh){
      var self = this;
      var f = _.bind(function(){
        self.trigger('refresh');
        _.delay(f, 20000);
      });
      f();
    }
  },

  render: function() {
    $(this.el).empty();

    if(!this.options.autoRefresh){
      $(this.el).append(this.views.news.render());
    }
    $(this.el).append(this.views.timeline.render());
    $(this.el).append(this.views.next.render());

    return $(this.el);
  }

});

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
      window.location = '/tatami/#/search/status/' + search;
  }
});

/*
Tags
*/
app.Model.FollowTagModel = Backbone.Model.extend({
  url : function(){
    return '/tatami/rest/tagmemberships/create';
  }
});

app.Model.UnFollowTagModel = Backbone.Model.extend({
  url : function(){
    return '/tatami/rest/tagmemberships/destroy';
  }
});

$(function() {

  app.views.searchFromHeaderView = new app.View.SearchFormHeaderView({
    el: $('#searchHeader')
  });

});

/**
 * TypeAhead configuration to handle live login and hashtags suggestions
 * @param element the container to hook
 */


function Suggester(element) {
    this.source = function (raw_query, process) {
        var caretPosition = Suggester.getCaretPos(element.get()[0]);
        var query = raw_query.substring(0, caretPosition);
        var matchLogin = query.match(patterns.login);
        var matchHash = query.match(patterns.hash);
        if (matchLogin === null && matchHash === null) {
            if (this.shown) {
                this.hide();
            }
            return;
        }
        var query2 = (matchLogin === null) ? matchHash[0] : matchLogin[0];

        // Didn't find a good reg ex that doesn't catch the character before # or @ : have to cut it down :
        query2 = (query2.charAt(0) != '#' && query2.charAt(0) != '@') ? query2.substring(1, query2.length) : query2;

        if (query2.length < 2) {return;} // should at least contains @ or # and another character to continue.

        switch (query2.charAt(0)) {
            case '@' :
                q = query2.substring(1, query2.length);
                return $.get('/tatami/rest/search/users', {q:q}, function (data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        results[i] = '@' + data[i].username;
                    }
                    return process(results);
                });
            case '#' :
                q = query2.substring(1, query2.length);
                return $.get('/tatami/rest/search/tags', {q:q}, function (data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        results[i] = '#' + data[i];
                    }
                    return process(results);
                });
        }
    };
    this.matcher = function (item) {
        return true;
    };
    this.updater = function (item) {
        var caretPosition = Suggester.getCaretPos(element.get()[0]);
        var firstPart = element.val().substring(0, caretPosition);
        var secondPart = element.val().substring(caretPosition, element.val().length);
        var firstChar = item.charAt(0);
        var newText = item;
        if (firstPart.lastIndexOf(firstChar) > -1) {
            newText = firstPart.substring(0, firstPart.lastIndexOf(firstChar)) + item + ' ' + secondPart;
        }
        return newText;
    };
}

Suggester.getCaretPos = function(element) {
	var caretPos = 0;	// IE Support
	if (document.selection) {
		element.focus ();
		var sel = document.selection.createRange ();
		sel.moveStart ('character', -element.value.length);
		caretPos = sel.text.length;
	}
	// Firefox support
	else if (element.selectionStart || element.selectionStart == '0')
		caretPos = element.selectionStart;
	return (caretPos);
};

/**
 * Webkit notifications manager
 */
function NotificationManager() {
	var n;
}

NotificationManager.setNotification = function(title, msg, reload) {
	if ( typeof title === 'undefined' || typeof msg === 'undefined') {return 0;}
	if (typeof  window.webkitNotifications === 'undefined') {return 0;}
	if (window.webkitNotifications.checkPermission() !== 0) {
        NotificationManager.setAllowNotification();
		return 0;
	}
	if (typeof NotificationManager.n !== 'undefined') {NotificationManager.n.cancel();}
	NotificationManager.n = window.webkitNotifications.createNotification('/favicon.ico', title, msg);
	NotificationManager.n.onclick = function() {
		window.focus();
		if (reload) {window.location.reload();}
		this.cancel();
	};
	NotificationManager.n.show();
};
NotificationManager.setAllowNotification = function(callback) {
	if (typeof  window.webkitNotifications === 'undefined') {return 0;}
	if (typeof  callback !== 'undefined') {
		window.webkitNotifications.requestPermission(callback);
	} else {
		window.webkitNotifications.requestPermission();
	}
};

// Fix Bootstrap navbar dropdown
$(function (){
  $('body')
  .on('touchstart.dropdown', '.dropdown-menu', function (e) {e.stopPropagation();})
  .on('touchstart.dropdown', '.dropdown-submenu', function (e) {e.preventDefault();});
});


app.Model.AccountProfile = Backbone.Model.extend({
    url: '/tatami/rest/account/profile',
    idAttribute: 'username',
    defaults : {
        username : window.username,
        firstName : '',
        lastName : '',
        jobTitle : '',
        phoneNumber : ''
    }
});

app.Model.FollowUser = Backbone.Model.extend({
    url: '/tatami/rest/friendships'
});

app.Model.CheckUser = Backbone.Model.extend({
    url: '/tatami/rest/friendships/check'
});

app.Model.Visit = Backbone.Model.extend({
    url: '/tatami/rest/visit',
    idAttribute: 'username'
});

app.View.WelcomeProfil = Backbone.View.extend({
  initialize : function(){
    this.header = document.createElement('div');
    this.$header = $(this.header);
    this.render();
  },

  model : new app.Model.AccountProfile(),

  template : {
    header : _.template($('#welcome-profile-header').html()),
    body : _.template($('#welcome-profile').html()),
    error : _.template($('#welcome-profile-error').html())
  },

  attributes : {
    'class' : 'form-horizontal row-fluid'
  },

  tagName : 'form',

  next : function(){
    var self = this;

    _.each(this.$el.serializeArray(), function(value){
      self.model.set(value.name, value.value);
    });

    this.model.save(null, {
      success : function(model){
        self.trigger('next');
      },
      error : function(model){
        self.$el.append(self.template.error());
      }
    });
  },

  previous : function(){
    this.trigger('previous');
  },

  render: function(){
    var self = this;

    this.$header.html(this.template.header());
    this.model.fetch({
      success : function(model){
        self.$el.html(self.template.body(model.toJSON()));
      },
      error : function(model){
        self.$el.html(self.template.body(model.toJSON()));
        self.$el.append(self.template.error());
      }
    });
    return this;
  },

  destroy : function(){
      this.$header.remove();
      this.remove();
      this.trigger('remove', this);
  }
});

app.View.WelcomeTag = Backbone.View.extend({
  initialize : function(){
    this.header = document.createElement('div');
    this.$header = $(this.header);
    this.render();
  },

  collection : new app.Collection.TrendsCollection(),

  template : {
    header : _.template($('#welcome-tags-header').html()),
    success : _.template($('#welcome-tags-success').html()),
    error : _.template($('#welcome-tags-error').html())
  },

  next : function(){
    this.trigger('next');
  },

  previous : function(){
    this.trigger('previous');
  },

  followTag : function(tag){
    var self = this;

    new app.Model.FollowTagModel({
      name : tag
    }).save(null, {
      success: function(model){
        self.$el.append(self.template.success(model.toJSON()));
      },
      error: function(model){
        self.$el.append(self.template.success(model.toJSON()));
      }
    });
  },

  render: function(){
    this.$header.html(this.template.header());

    var fill = d3.scale.category20();

    var self = this;

    var angleMax = 0;
    var angleMin = 0;
    var position = 0;


    var width = function(){
      return self.$el.width();
    };
    var height = function(){
      return self.$el.width() * 9/16;
    };

    function draw(words) {
      $(self.$el[0].childNodes).remove();

      d3.select(self.$el[0]).append("svg")
          .attr("width", width())
          .attr("height", height())
        .append("g")
          .attr("transform", "translate(" + width()/2 + "," + height()/2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", '"Helvetica Neue", Helvetica, Arial, sans-serif')
          .style("cursor", "pointer")
          //.style("fill", function(d, i) { return (~~(Math.random()*2)===0)?'#5bb75b':'#f89406';})
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .on('click', function(d){ self.followTag(d.text); })
          .on('click', function(d){ self.followTag(d.text); })
          .text(function(d) { return d.text; });
    }


    var resize = _.debounce(function() {
      generate(self.collection);
    }, 125);

    function generate(collection){
      if(width() !== 0 && height() !== 0){
        d3.layout.cloud().size([width(), height()])
          .words(collection.map(function(model){ return model.toJSON(); }))
          .text(function(d) { return d.tag; })
          .rotate(function(d) { return angleMin + ~~(Math.random() * position )  / ( position - 1 ) * (angleMax - angleMin);})
          .font('"Helvetica Neue", Helvetica, Arial, sans-serif')
          .fontSize(function(d) { return (d.trendingUp)? 90: 30; })
          .on("word", function(s){
            //console.log(s);
          })
          .on("end", draw)
          .start();
      }
      else {
        resize();
      }

      $(window).resize(resize);

      $(self.$el[0].childNodes).bind('remove', function(){
        layout.stop();
        $(window).off('resize', resize);
      });
    }

    this.collection.fetch({
      success : function(collection){
        if(collection.length > 0)
          generate(collection);
        else
          self.destroy();
      }
    });



    return this;
  },

  destroy : function(){
      this.$header.remove();
      this.remove();
      this.trigger('remove', this);
  }
});

app.View.WelcomeFriend = Backbone.View.extend({
  initialize : function(){
    this.header = document.createElement('div');
    this.$header = $(this.header);
    this.error = document.createElement('div');
    this.$error = $(this.error);
    this.render();
  },

  collection : new app.Collection.TrendsCollection(),

  template : {
    header : _.template($('#welcome-friends-header').html()),
    body : _.template($('#welcome-friends-body').html()),
    error : _.template($('#welcome-friends-error').html())
  },

  attributes : {
    'class' : 'form-horizontal row-fluid'
  },

  tagName : 'form',

  next : function(){
    var self = this;

    var emails = this.el.querySelector('[name=mails]').value;
    emails = this.toMails(emails);

    var callback = _.after(emails.length, function(){
      self.trigger('next');
    });

    this.check(emails, function(){
      self.follow(emails, function(){
        self.trigger('next');
      });
    });
  },

  check : function(mails, callback){
    var self = this;

    var cb = _.after(mails.length, function(){
      callback();
    });

    mails.forEach(function(mail){
      new app.Model.CheckUser({
        email : mail
      }).save(null, {
        success : cb,
        error : function(model, xhr){
          model.set('status', xhr.status);
          self.$error.html(self.template.error(model.toJSON()));
        }
      });
    });
  },

  follow : function(mails, callback){
    var self = this;

    var cb = _.after(mails.length, function(){
      callback();
    });

    mails.forEach(function(mail){
      new app.Model.FollowUser({
        email : mail
      }).save(null, {
        success : cb,
        error : function(model, xhr){
          model.set('status', xhr.status);
          self.$error.html(self.template.error(model.toJSON()));
        }
      });
    });
  },

  previous : function(){
    this.trigger('previous');
  },

  events : {
    'keyup textarea' : 'showMails'
  },

  showMails : function(e){
    var self = this;
    if(!this.$mails) {
      this.mails = this.el.getElementsByTagName('ul')[0];
      this.$mails = $(this.mails);
    }

    var value = e.target.value;
    this.$mails.empty();
    this.toMails(value).forEach(function(value){
      var li = document.createElement('li');
      li.textContent = value;
      self.$mails.append(li);
    });
  },

  toMails : function(string){
    return string.split(/[,\n]/).map(function(value){
      return value.trim();
    }).filter(function(value){
      var isEmail = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/gmi;
      return isEmail.test(value);
    });
  },

  render: function(){
    this.$header.html(this.template.header());
    this.$el.html(this.template.body());
    this.$el.append(this.$error);

    return this;
  },

  destroy : function(){
      this.$header.remove();
      this.remove();
      this.trigger('remove', this);
  }
});

app.View.Welcome = Backbone.View.extend({

  template : _.template($('#welcome').html()),

  attributes : {
    id : 'modal-welcome',
    'class' : 'modal fade hide',
    'data-backdrop' : 'static'
  },

  toHide : [$('#tatami-topmenu'), $('#mainPanel')],

  model : new app.Model.Visit(),

  initialize : function() {
    var self = this;

    this.tabs = [new app.View.WelcomeProfil(), new app.View.WelcomeTag(), new app.View.WelcomeFriend()],

    this.$el.on('show', function(){
      self.toHide.forEach(function(element){
        element.addClass('blur');
      });
    });
    this.$el.on('shown', function(){
      self.setMaxHeigth();
    });
    this.$el.on('hide', function(){
      self.toHide.forEach(function(element){
        element.removeClass('blur');
      });
    });

    $(window).resize(_.debounce(_.bind(this.setMaxHeigth, this)));

    this.currentTab = _.first(this.tabs);

    this.render();
  },

  setMaxHeigth : function(){
    var windowHeight = $(window).height();
    var heightModal = windowHeight * 0.8;
    var headerHeight = this.$el.find('.modal-header').outerHeight(true);
    var footerHeight = this.$el.find('.modal-footer').outerHeight(true);

    var height = heightModal - headerHeight - footerHeight;

    this.$el.find('.modal-body').css('max-height', height + 'px');
  },

  setRouter: function(router){
    var self = this;

    router.welcome = function(){
      self.show();
    };

    this.render();
  },

  events : {
    'click input.pull-left' : 'previous',
    'click input.pull-right' : 'next'
  },

  previous : function(){
    if(this.currentTab){
      this.currentTab.previous();
    }
  },

  next : function(){
    if(this.currentTab){
      this.currentTab.next();
    }
  },

  bindPrevious : function(){
    var self = this;
    if(this.currentTab) this.currentTab.off('previous');
    if(this.currentTab && _.first(this.tabs) !== this.currentTab) this.currentTab.on('previous', function(){
      var index = _.indexOf(self.tabs, self.currentTab);
      self.currentTab = self.tabs[index-1];
      self.render();
    });
  },

  bindNext : function(){
    var self = this;
    if(this.currentTab) this.currentTab.off('next');
    if(this.currentTab && _.last(this.tabs) !== this.currentTab) this.currentTab.on('next', function(){
      var index = _.indexOf(self.tabs, self.currentTab);
      self.currentTab = self.tabs[index+1];
      self.render();
    });
    else if(this.currentTab && _.last(this.tabs) === this.currentTab) this.currentTab.on('next', function(){
      self.model.set('username', window.username);
      self.model.destroy({
        success : function(){
          self.destroy();
        }
      });
    });
  },

  bindDestroy : function(){
    var self = this;
    this.tabs.forEach(function(view){
      view.on('remove', function(view){
        var index = self.tabs.indexOf(view);
        self.tabs.splice(index, 1);
      });
    });
  },

  destroy : function(){
    this.tabs.forEach(function(tab){
      tab.destroy();
    });
    this.$el.modal('hide');
    this.remove();
  },

  render : function(){
    this.$el.html(this.template({
      next : (_.last(this.tabs) !== this.currentTab),
      previous : (_.first(this.tabs) !== this.currentTab),
      finish : (_.last(this.tabs) === this.currentTab)
    }));

    this.bindNext();
    this.bindPrevious();
    this.bindDestroy();

    if(this.currentTab){
      this.$el.find('div.modal-header').html(this.currentTab.$header);
      this.$el.find('div.modal-body').html(this.currentTab.$el);
    }

    this.$el.modal('show');

    return this;
  }
});

app.View.ListUserGroup = Backbone.View.extend({
    tagName : 'table',
    attributes : {
        'class' : 'table'
    },
    initialize : function(){
        this.options = _.defaults(this.options, {
          admin : true
        });

        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.addItem, this);

        this.collection.fetch();
    },

    addItem : function(model){
        var view = new app.View.ListUserGroupItem(
          _.defaults({
            model : model
          }, this.options)
        );
        view.render();
        this.$el.append(view.el);
    },
    render : function(){
        var tableView = this;

        this.$el.html($('#usergroup-header').html());
        this.collection.forEach(this.addItem, this);

        return this;
    }
});

app.View.ListUserGroupItem = Backbone.View.extend({
    tagName : 'tr',

    template : _.template($('#usergroup-item').html()),

    initialize : function(){
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },

    events : {
        'click .delete' : 'removeUser'
    },

    removeUser : function(){
        this.model.destroy();
    },

    render : function(){
        var locals = this.model.toJSON();
        locals.admin = this.options.admin;
        this.$el.html(this.template(locals));
        return this;
    }

});

app.Model.ListUserGroupModel = Backbone.Model.extend({
    idAttribute : 'username',
    defaults : {
        gravatar : '',
        firstName : '',
        lastName : '',
        role : ''
    }
});

app.Collection.ListUserGroupCollection = Backbone.Collection.extend({
    model : app.Model.ListUserGroupModel,
    url : function() {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});