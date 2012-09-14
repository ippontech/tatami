
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
    Router: {}
  }, Backbone.Events);
}
else {
  app = window.app;
}

/*
  Profile
*/

app.Model.ProfileModel = Backbone.Model.extend({
  defaults: {
    'gravatar': '',
    'firstName': '',
    'lastName': ''
  },
  url : function(){
    return '/tatami/rest/users/show?screen_name=' + username;
  }
});

app.View.ProfileInfoView = Backbone.View.extend({
  template: _.template($('#profile-infos').html()),

  initialize: function() {
    $(this.el).addClass('row-fluid hidden-phone');

    this.model.bind('change', this.render, this);
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template({profile:this.model.toJSON()}));
    return $(this.el);
  }
});

app.View.ProfileStatsView = Backbone.View.extend({
  template: _.template($('#profile-stats').html()),

  initialize: function() {
    $(this.el).addClass('');

    this.model.bind('change', this.render, this);
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template({profile:this.model.toJSON()}));
    return $(this.el);
  }
});

app.View.UpdateView = Backbone.View.extend({
  tagName: 'form',
  template: _.template($('#update-template').html()),

  initialize: function() {
    $(this.el).addClass('row-fluid');
  },

  events: {
    'submit': 'addStatus'
  },

  addStatus: function(e) {
    var self = this;
    e.preventDefault();

    var status = new app.Model.StatusUpdateModel();

    _.each($(e.target).serializeArray(), function(value){
      status.set(value.name, value.value);
    });

    status.save(null,{
      success: function(model, response) {
          e.target.reset();
          $(self.el).find('.control-group').removeClass('error');

          $("#updateStatusContent").css("height", "20px");
          $("#updateStatusBtn").popover('show');
          $("#updateStatusContent").change();
          app.trigger('refreshProfile');
          app.trigger('refreshTimeline');
          setTimeout(function () {
              $("#updateStatusBtn").popover('hide');
          }, 3000);
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

app.View.ProfileView = Backbone.View.extend({
  initialize: function() {
    $(this.el).addClass('row-fluid');

    this.views = {
      info: new app.View.ProfileInfoView({
        model : this.model
      }),
      stats: new app.View.ProfileStatsView({
        model : this.model
      }),
      update: new app.View.UpdateView()
    };

    var self = this;

    app.on('refreshProfile', function() {
      self.model.fetch();
    });

    app.trigger('refreshProfile');
  },

  render: function() {
    $(this.el).empty();

    $(this.el).append(this.views.info.render());
    $(this.el).append(this.views.stats.render());
    $(this.el).append(this.views.update.render());

    return $(this.el);
  }
});

/*
  Profile Follow
*/

app.View.FollowFormView = Backbone.View.extend({
    tagName:'form',
    template:_.template($('#profile-find-form').html()),

    initialize:function () {
        $(this.el).addClass('row-fluid');
    },

    events:{
        'submit':'goToUserProfile'
    },

    goToUserProfile: function (e) {
        e.preventDefault();
        window.location.href = "/tatami/profile/" + $('#findUsername').val() + "/";
    },

    render:function () {
        $(this.el).html(this.template());
        $(this.el).find("#findUsername").typeahead({
            source:function (query, process) {
                return $.get('/tatami/rest/users/search', {q:query}, function (data) {
                    var results = [];
                    for (var i = 0; i < data.length; i++) {
                        results[i] = data[i].username;
                    }
                    return process(results);
                });
            }
        });
        return $(this.el);
    }
});

app.Collection.SuggestCollection = Backbone.Collection.extend({
  url : function(){
    return '/tatami/rest/users/suggestions';
  }
});

app.View.SuggestView = Backbone.View.extend({
  template: _.template($('#profile-follow-suggest-empty').html()),
  tagName: 'tbody',

  initialize: function() {
    var self = this;

    this.model = new app.Collection.SuggestCollection();

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
    var el = new app.View.SuggestItemView({
      model: item
    }).render();
    if(index === 0)
      $(this.el).prepend(el);
    else
      $(this.el).append(el);
  }
});

app.View.SuggestItemView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#profile-follow-suggest-item').html()),


  initialize: function() {
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template({follow:this.model.toJSON()}));
    return $(this.el);
  }
});

app.View.FollowView = Backbone.View.extend({
  template: _.template($('#profile-follow-suggest').html()),

  initialize: function() {
    this.views = {};
    this.views.form = new app.View.FollowFormView();
    this.views.suggest = new app.View.SuggestView();
  },

  render: function() {
    $(this.el).empty();
    $(this.el).append(this.views.form.render());
    $(this.el).append(this.template());
    $(this.el).find('#follow-suggest').append(this.views.suggest.render());

    return $(this.el);
  }
});

app.View.TrendsView = Backbone.View.extend({
    template: _.template($('#trends-template').html()),

    initialize: function() {
    },

    render: function() {
        $(this.el).html(this.template());
        this.delegateEvents();
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

    _.delay(_.bind(this.refresh, this), this.options.interval);

    $(this.el).find("abbr.timeago").timeago();
  },

  events: {
    'click': 'newStatus'
  },

  refresh: function(callback){
    var self = this;

    var sc = _.clone(this.model);
    delete sc._callbacks;

    var data = {};
    if( typeof _.first(self.temp.models) !== 'undefined')
      data.since_id = _.first(self.temp.models).get('statusId');
    else if(typeof _.first(self.model.models) !== 'undefined')
      data.since_id = _.first(self.model.models).get('statusId');

      sc.fetch({
          data:data,
          success:function () {
              if (sc.length > 0) {
                  document.title = "Tatami (" + (self.temp.length + sc.length) + ")";
              } else if (sc.length == 0 && typeof callback != 'undefined') {
                  document.title = "Tatami";
              }
              while (sc.length > 0) {
                  self.temp.unshift(sc.pop());
              }
              self.render();
              if (typeof callback === 'undefined') {
                  _.delay(_.bind(self.refresh, self), self.options.interval);
              } else {
                  document.title = "Tatami";
                  callback();
              }
          },
          error:function () {
              self.render();
              if (typeof callback === 'undefined') {
                  _.delay(_.bind(self.refresh, self), self.options.interval);
              } else {
                  callback();
              }
          }
    });
  },

  newStatus: function() {

    this.progress();
    var self = this;
      if (this.model.models.length === 0) {
          this.model.fetch({
              success:function () {
                  self.render();
              },
              error:function () {
                  self.render();
              }
          });
      } else {
          this.refresh(function () {
              while (self.temp.length > 0)
                  self.model.unshift(self.temp.pop());
              self.render();
          });
      }
  },

  render: function() {
    var $el = $(this.el);
    $el.html(this.template({status: this.temp.length}));
    this.delegateEvents();
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
    if(this.model.models.length === 0)
      this.model.fetch({
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
      delete sc._callbacks;

      sc.fetch({
        data: {
          max_id: _.last(self.model.models).get('statusId')
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
  },

  render: function() {
    $(this.el).empty();
    $(this.el).append(this.views.news.render());
    $(this.el).append(this.views.timeline.render());
    $(this.el).append(this.views.next.render());

    return $(this.el);
  }

});

/*
  Favorite
*/

app.View.FavoriteRefreshView = Backbone.View.extend({
  template: _.template($('#favorite-refresh').html()),
  progressTemplate: _.template($('#timeline-progress').html()),

  initialize: function(){
  },

  events: {
    'click': 'refreshStatus'
  },

  refreshStatus: function(done, context){
    this.progress();
    var self = this;
    this.model.fetch({
      success: function(){
        self.render();
      },
      error: function() {
        self.render();
      }
    });
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

app.View.FavoritePanelView = Backbone.View.extend({

  initialize: function(){
    this.views = {};
    this.views.timeline = new app.View.TimeLineView({
      model : this.model
    });
    this.views.refresh = new app.View.FavoriteRefreshView({
      model : this.model
    });

    this.views.refresh.refreshStatus();

    this.on('refresh', this.views.refresh.newStatus, this.views.refresh);

    app.on('refreshFavorite', this.views.refresh.refreshStatus, this.views.refresh);
  },

  render: function() {
    $(this.el).empty();
    $(this.el).append(this.views.refresh.render());
    $(this.el).append(this.views.timeline.render());

    return $(this.el);
  }

});

/*
Tags
*/

app.View.TagsSearchView = Backbone.View.extend({
  template: _.template($('#tag-search-form').html()),

  tagName: 'form',

  events: {
    'submit': 'submit'
  },

  initialize: function(){

    $(this.el).addClass('alert alert-info');

    this.nbStatus = 20;
    var self = this;
    this.model.url = function() {
      if(self.options.tag && self.options.tag !== '')
        return '/tatami/rest/tags/' + self.options.tag + '/' + self.nbStatus;
      else
        return '/tatami/rest/tags/' + self.nbStatus;
    };
  },

  submit: function(e) {
    e.preventDefault();

    var self = this;

    _.each($(this.el).serializeArray(), function(input){
      if(input.name === 'search')
        self.options.tag =input.value;
    });

    this.search();
  },

  search: function () {
    app.router.navigate('//tags/' + this.options.tag, {trigger: false,replace:false});
    this.fetch();
  },

  fetch : function() {
    this.model.fetch();
  },

  render: function () {
    var tag = (typeof this.options.tag === 'undefined')? '':this.options.tag;
    $(this.el).html(this.template({tag: tag}));
    return $(this.el);
  }

});

app.View.TagsView = Backbone.View.extend({
  initialize: function(){
    this.views = {};

    this.model = new app.Collection.StatusCollection();

    this.views.search = new app.View.TagsSearchView({
      tag: this.options.tag,
      model: this.model
    });

    this.views.list = new app.View.TimeLineView({
      model : this.model
    });

    this.views.search.fetch();
  },

  render: function () {
    $(this.el).append(this.views.search.render());
    $(this.el).append(this.views.list.render());
    return $(this.el);
  }

});

/*
Search
*/

app.View.SearchSearchView = Backbone.View.extend({
  template: _.template($('#search-search-form').html()),

  tagName: 'form',

  events: {
    'submit': 'submit'
  },

  initialize: function(){

    $(this.el).addClass('alert alert-info');

    this.nbStatus = 20;
  },

  submit: function(e) {
    e.preventDefault();

    var self = this;

    _.each($(this.el).serializeArray(), function(input){
      if(input.name === 'search')
        self.model.options.search = input.value;
    });

    this.search();
  },

  search: function () {
    app.router.navigate('//search/' + this.model.options.search, {trigger: false,replace:false});
    this.fetch();
  },

  fetch : function() {
    var self = this;
    if(typeof this.model.options.search !== 'undefined'){
      this.model.fetch({
        data: {
          q: this.model.options.search,
          page: this.model.options.page,
          rpp: this.model.options.rpp
        },
        success: function(){
          self.model.options.page++;
        }
      });
    }
  },

  render: function () {
    var search = (typeof this.model.options.search === 'undefined')? '':this.model.options.search;
    $(this.el).html(this.template({search: search}));
    return $(this.el);
  }

});

app.View.SearchNextView = Backbone.View.extend({
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

    var sc = new app.Collection.StatusCollection();
    sc.url = '/tatami/rest/search';

    sc.fetch({
      data: {
        q: this.model.options.search,
        page: this.model.options.page,
        rpp: this.model.options.rpp
      },
      success: function(){
        self.model.options.page++;
        _.each(sc.models, function(model, key) {
          self.model.push(model);
        });
        if(sc.length > 0 && sc.length%self.model.options.rpp === 0)
          self.render();
        else
          self.remove();
      },
      error: function() {
        self.render();
      }
    });

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

app.View.SearchView = Backbone.View.extend({
  initialize: function(){
    this.model = new app.Collection.StatusCollection();
    this.model.options = {
      search: this.options.search,
      rpp: this.options.rpp,
      page: 0
    };

    this.model.url = '/tatami/rest/search';
    this.model.bind('reset', function(){
      this.options.page = 0;
    }, this.model);

    this.views = {};

    this.views.search = new app.View.SearchSearchView({
      model: this.model
    });

    this.views.list = new app.View.TimeLineView({
      model : this.model
    });

    this.views.next = new app.View.SearchNextView({
      model : this.model
    });

    this.views.next.nextStatus();
  },

  render: function () {
    $(this.el).append(this.views.search.render());
    $(this.el).append(this.views.list.render());
    $(this.el).append(this.views.next.render());
    return $(this.el);
  }

});

/*
  Statistics
*/

app.Collection.DailyStatCollection = Backbone.Collection.extend({
  url: '/tatami/rest/stats/day'
});

app.View.DailyStatsView = Backbone.View.extend({
  initialize: function() {
    this.model = new app.Collection.DailyStatCollection();
    this.model.bind('reset', this.render, this);

    this.model.fetch();
  },

  render: function() {
    var values = [];
    var labels = [];
    this.model.each(function(model){
      values.push(model.get('statusCount'));
      labels.push(model.get('username'));
    });
    
    $(this.el).pie(values, labels);

    return $(this.el);
  }
});


/*
Initialization
*/

app.Router.HomeRouter = Backbone.Router.extend({

    initialize:function () {
        var profile = app.views.profile = new app.View.ProfileView({
            model:new app.Model.ProfileModel()
        });
        $('#profileContent').html(profile.render());
        $("#updateStatusContent").focus(function () {
            $(this).css("height", "200px");
        });
        $("#updateStatusContent").charCount({
            css:'counter',
            cssWarning:'counter_warning',
            cssExceeded:'counter_exceeded',
            allowed:500,
            warning:50,
            counterText:text_characters_left + " "
        });
        $("#updateStatusContent").bind('keypress', function (e) {
            var keycode = (e.keycode ? e.keycode : e.which);
            if (keycode == 64) { //the user pressed the "@" key
               // TODO drop down list of users
            } else if (keycode == 35) { //the user pressed the "#" key
               // TODO drop down list of tags
            }
        });

        $("#updateStatusBtn").popover({
            animation:true,
            placement:'bottom',
            trigger:'manual'
        });
        $("#contentHelp").popover({
            animation:true,
            placement:'right'
        });

        var follow = app.views.follow = new app.View.FollowView();
        $('#profileFollow').html(follow.render());

        var trends = new app.View.TrendsView();
        $('#trends').html(trends.render());
    },

  selectMenu: function(menu) {
    $('.homeMenu a').parent().removeClass('active');
    $('.homeMenu a[href="#/' + menu + '"]').parent().addClass('active');
  },

  routes: {
    "timeline": "timeline",
    "favorite": "favorite",
    "tags": "tags",
    "tags/*tag": "tags",
    "search": "search",
    "search/*search": "search",
    "daily": "daily",
    "*action": "timeline"
  },

  timeline: function(action) {
    this.selectMenu('timeline');
    if(!app.views.timeline) {
      var timelinecollection = new app.Collection.StatusCollection();
      timelinecollection.url = '/tatami/rest/statuses/home_timeline';

      app.views.timeline = new app.View.TimeLinePanelView({
        model: timelinecollection
      });
    }
    else
      app.views.timeline.trigger('new');
    $('#tab-content').empty();
    $('#tab-content').append(app.views.timeline.render());
  },

  favorite: function() {
    this.selectMenu('favorite');
    if(!app.views.favorite) {
      var favoriteCollection = new app.Collection.StatusCollection();
      favoriteCollection.url = '/tatami/rest/favorites';
      app.views.favorite = new app.View.FavoritePanelView({
        model: favoriteCollection
      });
    }
      app.views.favorite.trigger('refresh');
    $('#tab-content').empty();
    $('#tab-content').append(app.views.favorite.render());
  },

  tags: function(tag) {
    this.selectMenu('tags');
    app.views.tags = new app.View.TagsView({
      tag: tag
    });
    $('#tab-content').empty();
    $('#tab-content').append(app.views.tags.render());
  },

  search: function(search) {
    if(search && search.match(/^#[a-zA-Z0-9]*$/)){
      this.tags(search.substr(1));
      app.router.navigate('//tags/' + search.substr(1), {trigger: true,replace:true});
    }
    else {
      this.selectMenu('search');
      app.views.search = new app.View.SearchView({
        search: search
      });
      $('#tab-content').empty();
      $('#tab-content').append(app.views.search.render());
    }
  },

  daily: function() {
    this.selectMenu('daily');
    app.views.daily = new app.View.DailyStatsView();
    $('#tab-content').empty();
    $('#tab-content').append(app.views.daily.render());
  }
});

$(function() {

  app.router = new app.Router.HomeRouter();
  Backbone.history.start();

});