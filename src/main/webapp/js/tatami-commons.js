var patterns = {
	login: /(^|[^\w])@[\w]*$/gim,
	hash: /(^|[^\w])#[\w]*$/gim
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
            },

    },

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
    tagName: 'tbody',

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
    tagName: 'tr',
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
            content: 'test',
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
      $(this.el).find("textarea.reply").typeahead({
    	  textarea: element
          , source:function (query, process) {

          	var matchLogin = query.match(patterns.login);
          	var matchHash = query.match(patterns.hash);
          	if (matchLogin == null && matchHash == null) {return;}
          	var query2 = (matchLogin == null) ? matchHash[0] : matchLogin[0];

          	// Didn't find a good reg ex that doesn't catch the character before # or @ : have to cut it down :
          	query2 = (query2.charAt(0) != '#' && query2.charAt(0) != '@') ? query2.substring(1, query2.length) : query2;

          	if (query2.length < 2) {return;} // should at least contains @ or # and another character to continue.

              switch (query2.charAt(0)) {
      		  case '@' :
      			q = query2.substring(1, query2.length);
      			return $.get('/tatami/rest/users/search', {q:q}, function (data) {
      		        var results = [];
      		        for (var i = 0; i < data.length; i++) {
      		            results[i] = '@' + data[i].username;
      		        }
      		        return process(results);
      		    });
      			break;
      		  case '#' :
      			q = query2.substring(1, query2.length);
      			return $.get('/tatami/rest/tags/search', {q:q}, function (data) {
      		        var results = [];
      		        for (var i = 0; i < data.length; i++) {
      		            results[i] = '#' + data[i];
      		        }
      		        return process(results);
      		    });
      			break;
      		}

          }
        , matcher: function (item) {
            return true;
          }
        , updater: function (item) {
      	    container = this.options.textarea;
  			var textBefore = container.val();
  			var firstChar = item.charAt(0);
  			var textAfter = item;
  			if (textBefore.lastIndexOf(firstChar) > -1) {
  				textAfter = textBefore.substring(0, textBefore.lastIndexOf(firstChar)) + item + ' ';
  			}
            return textAfter;
          }
        });
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

unfollowRender: function() {
  $(this.el).html(this.templateUnFollow());
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
      window.location = '/tatami/#/search/' + search;
  }
});

$(function() {

  app.views.searchFromHeaderView = new app.View.SearchFormHeaderView({
    el: $('#searchHeader')
  });

});

/*
 * Feed the suggestion popup container with the results
 */
function feedSuggestions(target, results) {
	if (target == null || results == null) {
		return;
	}
	var prevSibblingEl = target.prev();
	if (prevSibblingEl != null && !prevSibblingEl.hasClass('suggest')) {
		$('<div class="suggest"><ul class="suggest-menu"></ul></div>').insertBefore(target);
	}
	var suggestionEl = target.parent().find('.suggest');

	var ul = suggestionEl.find('ul.suggest-menu');
	ul.find('li').remove(); // clean any previous results
    for (var i = 0; i < results.length; i++) {
    	ul.append(
    	    $('<li>').attr('class', 'suggest').append(results[i])
    	);
	}
    ul.find("li.suggest").bind("click", function() {
    	updateStatusWithSuggestion(target, $(this).text());
    	suggestionEl.hide();
    });
    suggestionEl.show();
}

/*
 * Search against one of the two services depending on the query first char (@ or # allowed)
 * The target is the textarea under which a suggestion container should display the results list
 */
function searchSuggestions(query, targetDOM) {
	var target = $(targetDOM);
	if (target == null
			|| query == null || query.length == 0
			|| (query.charAt(0) != '@' && query.charAt(0) != '#')) {
		return;
	}

	switch (query.charAt(0)) {
		case '@' :
			q = query.substring(1, query.length);
			$.get('/tatami/rest/users/search', {q:q}, function (data) {
		        var results = [];
		        for (var i = 0; i < data.length; i++) {
		            results[i] = '@' + data[i].username;
		        }
		        feedSuggestions(target, results);
		    });
			break;
		case '#' :
			q = query.substring(1, query.length);
			$.get('/tatami/rest/tags/search', {q:q}, function (data) {
		        var results = [];
		        for (var i = 0; i < data.length; i++) {
		            results[i] = '#' + data[i];
		        }
		        feedSuggestions(target, results);
		    });
			break;
	}

}

/*
 * Update a status with a suggestion.
 * Replace the last expression (could be a user id beginning with @ or a hashtag with '#')
 * with the value provided.
 * @param container is a jQuery Textarea wrapper
 * @value the value to inject in place of the last characters
 */
function updateStatusWithSuggestion(container, value) {
	if (container == null || container.val().length == 0
			|| value == null || value.length == 0
			|| (value.charAt(0) != '@' && value.charAt(0) != '#')) {
		return;
	}
	var textBefore = container.val();
	var firstChar = value.charAt(0);
	if (textBefore.lastIndexOf(firstChar) > -1) {
		var textAfter = textBefore.substring(0, textBefore.lastIndexOf(firstChar)) + value + ' ';
		container.focus();
		container.val('');
		container.val(textAfter);
		jQuery.Event("keyup");
		e.which = 32;
		target.trigger(e);
	}
	var suggestionEl = container.parent().find('.suggest');

	var ul = suggestionEl.find('ul.suggest-menu');
	ul.find('li').remove(); // clean any previous results

}
