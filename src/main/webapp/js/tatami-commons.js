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
    gfm:true,
    pedantic:false,
    sanitize:true
});

var app = window.app = _.extend({
        views:{},
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
  url : '/tatami/rest/statuses/update'
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
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);

        this.model.fetch();
    },

    render: function() {
        $(this.el).empty();
        if(this.model.length > 0)
            _.each(this.model.models, this.addItem, this);
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
    })

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
            content: 'test'
        });
        shareBtn.popover('show');
        setTimeout(function () {
            shareBtn.popover('hide');
        }, 3000);
    },

  detailsAction:function () {
    var statusId = this.model.get('statusId');
    var self = this;

    if (this.details != true) {
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
    'submit .reply-form': 'sendReply'
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
      }
    });

  },

  render: function() {
      var model = this.model.toJSON();
      model.markdown = marked(model.content);

      $(this.el).html(this.template({
          status:model,
          discuss:(this.options.discuss)
      }));

      $(this.el).find("abbr.timeago").timeago();
      var element = $(this.el).find("textarea.reply");
      $(this.el).find("textarea.reply").typeahead(new Suggester(element));
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
	  this.events = {};
	  this.editMyProfile();
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

follow: function() {
  var self = this;
  this.undelegateEvents();
  $(this.el).empty();

  var m = new app.Model.FollowUserModel();
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

  var m = new app.Model.UnFollowUserModel();
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

editMyProfile: function() {
  $(this.el).html(this.templateUserEdit());
},

render: function() {
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
        if (matchLogin == null && matchHash == null) {
            if (this.shown) {
                this.hide();
            };
            return;
        }
        var query2 = (matchLogin == null) ? matchHash[0] : matchLogin[0];

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
                break;
            case '#' :
                q = query2.substring(1, query2.length);
                return $.get('/tatami/rest/search/tags', {q:q}, function (data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        results[i] = '#' + data[i];
                    }
                    return process(results);
                });
                break;
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
};
NotificationManager.setNotification = function(title, msg, reload) {
	if (title == null || msg == null) {return 0;}
	if (!window.webkitNotifications) {return 0;}
	if (window.webkitNotifications.checkPermission() != 0) {
        NotificationManager.setAllowNotification();
		return 0;
	}
	if (NotificationManager.n != null) {NotificationManager.n.cancel();}
	NotificationManager.n = window.webkitNotifications.createNotification('/favicon.ico', title, msg);
	NotificationManager.n.onclick = function(x) {
		window.focus();
		if (reload) {window.location.reload();}
		this.cancel();
	};
	NotificationManager.n.show();
};
NotificationManager.setAllowNotification = function(callback) {
	if (!window.webkitNotifications) {return 0;}
	if (callback != null) {
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

//Capitalize
function capitalizeLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
* Search engine
*
*
*/

app.Collection.searchEngine = Backbone.Collection.extend({
    url: function(){
        return '/tatami/rest/search/all';
    }
});

$("#fullSearchText").typeahead({

    source: function(query,process){
        var model = new app.Collection.searchEngine();
        model.fetch({
            data:{
                q: query
            },
            success:function(model){
                model = model.toJSON();
                return process(model);
            }

        });
    },

    matcher: function (item) {
        return item;
    },

    sorter: function (items) {
        var data = [];

        items = items[0];

        items.tags.forEach(function(v){
            var obj = {};
            obj.label = '#'+v;
            obj.category = "tags";
            data.push(obj);
        });

        items.users.forEach(function(v){
            var obj = {};
            obj.label = '@'+v.username;
            obj.fullName = v.firstName+' '+ v.lastName;
            obj.category = "users";
            data.push(obj);
        });

        items.groups.forEach(function(v){
            var obj = {};
            obj.label = v.name;
            obj.id = v.groupId;
            obj.category = "groups";
            data.push(obj);
        });

        JSON.stringify(data);

        return data;
    },

    highlighter: function (item) {
        switch(item){
            case 'tags':
                item = '<i class="icon-tags"></i>';
                break;
            case 'users':
                item = '<i class="icon-user"></i>';
                break;
            case 'groups':
                item = '<i class="icon-th-large"></i>';
                break;
        }

        return item;
    },

    render: function(items){
        var self = this,
        currentCategory = "";
        this.$menu.empty();

        $.each( items, function( index, item ) {
            if ( item.category != currentCategory ) {
                currentCategory = item.category;
                g = $(self.options.group).append(self.highlighter(item.category));
                g.addClass(currentCategory);
                self.$menu.append(g);
            }
            i = $(self.options.item).attr('data-value', item.label);

            switch(item.category){
                case 'users':
                    i.addClass('users');
                    i.find('a').before('<img src="/img/ippon-logo.png" width="30px" height="30px">');
                    i.find('a').wrap('<h4></h4>');
                    i.append('<p>'+item.fullName+'</p>');
                    break;
                case 'groups':
                    i.attr('rel',item.id);
                    break;
            }


            i.find('a').html(item.label);
            $(i).appendTo( self.$menu );

        });

        $(this.$menu).children('li.category').next().addClass('first');

        return this
    },

    select: function () {
        var val = this.$menu.find('.active').attr('data-value');
        var groupId =  this.$menu.find('.active').attr('rel');
        this.$element.val(this.updater(val)).change();

        switch(val.charAt(0)){
            case '#':
                window.location = '/tatami/#/tags/'+val.substr(1);
                break;
            case '@':
                window.location = '/tatami/profile/'+val.substr(1)+'/';
                break;
            default:
                window.location = '/tatami/#/groups/'+groupId;
                break;
        }

        return this.hide()
    }

});

