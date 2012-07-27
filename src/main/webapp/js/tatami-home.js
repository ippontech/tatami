
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
    Profile
  */

  var ProfileModel = app.Model.ProfileModel = Backbone.Model.extend({
    defaults: {
      'gravatar': '',
      'firstName': '',
      'lastName': ''
    },
    url : function(){
      return '/tatami/rest/users/show?screen_name=' + username;
    }
  });

  var StatusUpdateModel = app.Model.StatusUpdateModel;

  var ProfileInfoView = app.View.ProfileInfoView = Backbone.View.extend({
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

  var ProfileStatsView = app.View.ProfileStatsView = Backbone.View.extend({
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

  var UpdateView = app.View.UpdateView = Backbone.View.extend({
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

  var ProfileView = app.View.profile = Backbone.View.extend({
    initialize: function() {
      $(this.el).addClass('row-fluid');

      this.views = {
        info: new ProfileInfoView({
          model : this.model
        }),
        stats: new ProfileStatsView({
          model : this.model
        }),
        update: new UpdateView()
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
  var FollowModel = app.Model.FollowModel;

  var FollowFormView = app.View.FollowFormView = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#profile-follow-form').html()),

    initialize: function() {
      $(this.el).addClass('row-fluid');
    },

    events: {
      'submit': 'addStatus'
    },

    addStatus: function(e) {
      var self = this;
      e.preventDefault();

      var user = new FollowModel();

      _.each($(e.target).serializeArray(), function(value){
        user.set(value.name, value.value);
      });

      user.save(null,{
        success: function(model, response) {
          e.target.reset();
          $(self.el).find('.control-group').removeClass('error');
        },
        error: function(model, response) {
          $(self.el).find('.control-group').addClass('error');
        }
      });
    },

    render: function() {
      $(this.el).html(this.template());
      return $(this.el);
    }
  });

  var SuggestCollection = app.Collection.SuggestCollection = Backbone.Collection.extend({
    url : function(){
      return '/tatami/rest/users/suggestions';
    }
  });

  var SuggestView = app.View.SuggestView = Backbone.View.extend({
    template: _.template($('#profile-follow-suggest-empty').html()),
    tagName: 'tbody',

    initialize: function() {
      var self = this;

      this.model = new SuggestCollection();

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
      var el = new SuggestItemView({
        model: item
      }).render();
      if(index === 0)
        $(this.el).prepend(el);
      else
        $(this.el).append(el);
    }
  });

  var SuggestItemView = app.View.SuggestItemView = Backbone.View.extend({
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

  var FollowView = app.View.FollowView = Backbone.View.extend({
    template: _.template($('#profile-follow-suggest').html()),

    initialize: function() {
      this.views = {};
      this.views.form = new FollowFormView();
      this.views.suggest = new SuggestView();
    },

    render: function() {
      $(this.el).empty();
      $(this.el).append(this.views.form.render());
      $(this.el).append(this.template());
      $(this.el).find('#follow-suggest').append(this.views.suggest.render());

      return $(this.el);
    }
  });



  /*
    Timeline
  */

  var StatusCollection = app.Collection.StatusCollection;

  var StatusDelete = app.Model.StatusDelete;

  var StatusAddFavorite = app.Model.StatusAddFavorite;

  var StatusRemoveFavorite = app.Model.StatusRemoveFavorite;

  var TimeLineItemView = app.View.TimeLineItemView;

  var TimeLineView = app.View.TimeLineView;

  var TimeLineNewView = app.View.TimeLineNewView = Backbone.View.extend({
    template: _.template($('#timeline-new').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
      this.temp = new StatusCollection();

      _.delay(_.bind(this.refresh, this), this.options.interval);
    },

    events: {
      'click': 'newStatus'
    },

    refresh: function(callback){
      var self = this;

      var sc = _.clone(this.model);

      var data = {};
      if( typeof _.first(self.temp.models) !== 'undefined')
        data.since_id = _.first(self.temp.models).get('statusId');
      else if(typeof _.first(self.model.models) !== 'undefined')
        data.since_id = _.first(self.model.models).get('statusId');

      sc.fetch({
        data: data,
        success: function(){
          while(sc.length > 0)
            self.temp.unshift(sc.pop());
          self.render();
          _.delay(_.bind(self.refresh, self), self.options.interval);
        },
        error: function() {
          self.render();
          _.delay(_.bind(self.refresh, self), self.options.interval);
        }
      });
    },

    newStatus: function() {

      this.progress();
      var self = this;

      if(this.model.models.length === 0)
        this.model.fetch({
          success: function(){
            self.render();
          },
          error: function() {
            self.render();
          }
        });
      else{
        while(self.temp.length > 0)
          self.model.unshift(self.temp.pop());
        self.render();
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

  var TimeLineNextView = app.View.TimeLineNextView = Backbone.View.extend({
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

  var TimeLinePanelView = app.View.TimeLinePanelView = Backbone.View.extend({

    initialize: function(){
      this.views = {};
      this.views.timeline = new TimeLineView({
        model : this.model
      });
      this.views.new = new TimeLineNewView({
        interval: 5000,
        model : this.model
      });
      this.views.next = new TimeLineNextView({
        model : this.model
      });

      this.views.next.nextStatus();

      this.on('refresh', this.views.new.newStatus, this.views.new);
      this.on('next', this.views.next.nextStatus, this.views.next);
      
      app.on('refreshTimeline', this.views.new.newStatus, this.views.new);
    },

    render: function() {
      $(this.el).empty();
      $(this.el).append(this.views.new.render());
      $(this.el).append(this.views.timeline.render());
      $(this.el).append(this.views.next.render());

      return $(this.el);
    }

  });

  /*
    Favoris
  */

  var FavorisRefreshView = app.View.FavorisRefreshView = Backbone.View.extend({
    template: _.template($('#favoris-refresh').html()),
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

  var FavorisPanelView = app.View.FavorisPanelView = Backbone.View.extend({

    initialize: function(){
      this.views = {};
      this.views.timeline = new TimeLineView({
        model : this.model
      });
      this.views.refresh = new FavorisRefreshView({
        model : this.model
      });

      this.views.refresh.refreshStatus();

      this.on('refresh', this.views.refresh.newStatus, this.views.refresh);

      app.on('refreshFavoris', this.views.refresh.refreshStatus, this.views.refresh);
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

  var TagsSearchView = app.View.TagsSearchView = Backbone.View.extend({
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

  var TagsView = app.View.TagsView = Backbone.View.extend({
    initialize: function(){
      this.views = {};

      this.model = new StatusCollection();

      this.views.search = new TagsSearchView({
        tag: this.options.tag,
        model: this.model
      });

      this.views.list = new TimeLineView({
        model : this.model
      });


      this.views.next.nextStatus();
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

  var SearchSearchView = app.View.SearchSearchView = Backbone.View.extend({
    template: _.template($('#search-search-form').html()),

    tagName: 'form',

    events: {
      'submit': 'submit'
    },

    initialize: function(){

      $(this.el).addClass('alert alert-info');

      this.nbStatus = 20;
      var self = this;
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

  var SearchNextView = app.View.SearchNextView = Backbone.View.extend({
    template: _.template($('#timeline-next').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
      $(this.el).infinitiScroll();
    },

    events: {
      'click': 'nextStatus'
    },

    nextStatus: function(){
      this.progress();
      this.model.nextStatus(this.render, this);
    },

    nextStatus: function(done, context){
      this.progress();
      var self = this;

      var sc = _.clone(this.model);

      var sc = new StatusCollection();
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

  var SearchView = app.View.SearchView = Backbone.View.extend({
    initialize: function(){
      var self = this;

      this.model = new StatusCollection();
      this.model.options = {
        search: this.options.search,
        rpp: 2,
        page: 0
      };

      this.model.url = '/tatami/rest/search';
      this.model.bind('reset', function(){
        this.options.page = 0;
      }, this.model);

      this.views = {};

      this.views.search = new SearchSearchView({
        model: this.model
      });

      this.views.list = new TimeLineView({
        model : this.model
      });

      this.views.next = new SearchNextView({
        model : this.model,

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
  Initialisation
*/

  var HomeRouter = app.Router.HomeRouter = Backbone.Router.extend({

    initialize: function() {
      var profile = app.views.profile = new ProfileView({
        model : new ProfileModel()
      });
      $('#profileContent').html(profile.render());

      var follow = app.views.follow = new FollowView();
      $('#profileFollow').html(follow.render());
    },

    selectMenu: function(menu) {
      $('.homeMenu a').parent().removeClass('active');
      $('.homeMenu a[href="#/' + menu + '"]').parent().addClass('active');
    },

    routes: {
      "timeline": "timeline",
      "favoris": "favoris",
      "tags": "tags",
      "tags/*tag": "tags",
      "search": "search",
      "search/*search": "search",
      "*action": "timeline"
    },

    timeline: function(action) {
      this.selectMenu('timeline');
      if(!app.views.timeline) {
        var timelinecollection = new StatusCollection();
        timelinecollection.url = '/tatami/rest/statuses/home_timeline';
        var timeline = app.views.timeline = new TimeLinePanelView({
          model: timelinecollection
        });
      }
      else
        app.views.timeline.trigger('new');
      $('#tab-content').empty();
      $('#tab-content').append(app.views.timeline.render());
    },

    favoris: function() {
      this.selectMenu('favoris');
      if(!app.views.favoris) {
        var favoriscollection = new StatusCollection();
        favoriscollection.url = '/tatami/rest/favorites';
        var favoris = app.views.favoris = new FavorisPanelView({
          model: favoriscollection
        });
      }
        app.views.favoris.trigger('refresh');
      $('#tab-content').empty();
      $('#tab-content').append(app.views.favoris.render());
    },

    tags: function(tag) {
      this.selectMenu('tags');
      var tags = app.views.tags = new TagsView({
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
        var search = app.views.search = new SearchView({
          search: search
        });
        $('#tab-content').empty();
        $('#tab-content').append(app.views.search.render());
      }
    }

  });

  app.router = new HomeRouter();
  Backbone.history.start();

});