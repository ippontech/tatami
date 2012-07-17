
$(function() {

  _.templateSettings = {
      interpolate: /\<\@\=(.+?)\@\>/gim,
      evaluate: /\<\@(.+?)\@\>/gim
  };

  var app = window.app = _.extend({
    views: {}
  }, Backbone.Events);





  /*
    Profile
  */

  var ProfileModel = Backbone.Model.extend({
    defaults: {
      'gravatar': '',
      'firstName': '',
      'lastName': ''
    },
    url : function(){
      return '/tatami/rest/users/show?screen_name=' + username;
    }
  });

  var StatusUpdateModel = Backbone.Model.extend({
    url : '/tatami/rest/statuses/update'
  });

  var ProfileInfoView = Backbone.View.extend({
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

  var ProfileStatsView = Backbone.View.extend({
    template: _.template($('#profile-stats').html()),

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

  var ProfileUpdateView = Backbone.View.extend({
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

  var ProfileView = app.views.profile = Backbone.View.extend({
    initialize: function() {
      $(this.el).addClass('row-fluid');

      this.views = {
        info: new ProfileInfoView({
          model : this.model
        }),
        stats: new ProfileStatsView({
          model : this.model
        }),
        update: new ProfileUpdateView()
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
  var FollowModel = Backbone.Model.extend({
    url : function(){
      return '/tatami/rest/friendships/create';
    }
  });

  var FollowFormView = Backbone.View.extend({
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

  var SuggestCollection = Backbone.Collection.extend({
    url : function(){
      return '/tatami/rest/users/suggestions';
    }
  });

  var SuggestView = Backbone.View.extend({
    template: _.template($('#profile-follow-suggest-empty').html()),

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

  var SuggestItemView = Backbone.View.extend({
    tagName: 'td',
    template: _.template($('#profile-follow-suggest-item').html()),


    initialize: function() {
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template({follow:this.model.toJSON()}));
      return $(this.el);
    }
  });

  var FollowView = Backbone.View.extend({
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
      $(this.el).find('#follow-suggest').html(this.views.suggest.render());

      return $(this.el);
    }
  });

  var follow = app.views.follow = new FollowView();
  $('#profileFollow').html(follow.render());



  /*
    Timeline
  */

  var StatusCollection = Backbone.Collection.extend({
  });

  var StatusDelete = Backbone.Model.extend({
    url: function(){
      return '/tatami/rest/statuses/destroy/' + this.model.get('statusId');
    },
    initialize: function(model) {
      this.model = model;
    }
  });

  var StatusAddFavorite = Backbone.Model.extend({
    url: function(){
      return '/tatami/rest/favorites/create/' + this.model.get('statusId');
    },
    initialize: function(model) {
      this.model = model;
    }
  });

  var StatusRemoveFavorite = Backbone.Model.extend({
    url: function(){
      return '/tatami/rest/favorites/destroy/' + this.model.get('statusId');
    },
    initialize: function(model) {
      this.model = model;
    }
  });

  var TimeLineItemView = Backbone.View.extend({
    template: _.template($('#timeline-item').html()),

    initialize: function() {
      $(this.el).addClass('alert alert-info');

      this.model.bind('destroy', this.remove, this);
    },

    events: {
      'click .status-action-favoris': 'favorisAction',
      'click .status-action-remove': 'removeAction',
    },

    favorisAction: function() {
      var self = this;
      var sd;
      if(this.model.get('favorite') === true)
        sd = new StatusRemoveFavorite(this.model);
      else
        sd = new StatusAddFavorite(this.model);

      sd.save(null, {
        success: function(){
          self.model.set('favorite', !self.model.get('favorite'));
          self.render();
        }
      });
    },

    removeAction: function() {
      var self = this;
      var sd = new StatusDelete(this.model);

      sd.save(null, {
        success: function(){
          app.trigger('refreshProfile');
          self.model.destroy();
        }
      });
    },

    render: function() {
      var $el = $(this.el);
      $el.html(this.template({status:this.model.toJSON()}));
      $(this.el).tagLinker('.status-content').usernameLinker('.status-content');
      return $(this.el);
    }
  });

  var TimeLineView = Backbone.View.extend({
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
      var el = new TimeLineItemView({
        model: item
      }).render();
      if(index === 0)
        $(this.el).prepend(el);
      else
        $(this.el).append(el);
    }
  });

  var TimeLineNewView = Backbone.View.extend({
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
            since_id: _.first(self.model.models).get('statusId')
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

  var TimeLineNextView = Backbone.View.extend({
    template: _.template($('#timeline-next').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
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

  var TimeLinePanelView = Backbone.View.extend({

    initialize: function(){
      this.views = {};
      this.views.timeline = new TimeLineView({
        model : this.model
      });
      this.views.new = new TimeLineNewView({
        model : this.model
      });
      this.views.next = new TimeLineNextView({
        model : this.model
      });

      this.views.next.nextStatus();

      this.on('new', this.views.new.newStatus, this.views.new);
      this.on('next', this.views.next.nextStatus, this.views.next);
    },

    render: function() {
      $(this.el).empty();
      $(this.el).append(this.views.new.render());
      $(this.el).append(this.views.timeline.$el);
      $(this.el).append(this.views.next.render());

      return $(this.el);
    }

  });

  /*
    Favoris
  */

  var FavorisRefreshView = Backbone.View.extend({
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

  var FavorisPanelView = Backbone.View.extend({

    initialize: function(){
      this.views = {};
      this.views.timeline = new TimeLineView({
        model : this.model
      });
      this.views.refresh = new FavorisRefreshView({
        model : this.model
      });

      var self = this;
      this.on('refresh', function() {
        self.views.refresh.newStatus();
      });

      this.views.refresh.refreshStatus();

      /*this.views.next = new TimeLineNextView({
        model : this.model
      });
      this.views.next.nextStatus();
      this.on('next', this.views.next.nextStatus, this.views.next);*/


      app.on('refreshFavoris', this.views.refresh.refreshStatus, this.views.refresh);
    },

    render: function() {
      $(this.el).empty();
      $(this.el).append(this.views.refresh.render());
      $(this.el).append(this.views.timeline.$el);
      //$(this.el).append(this.views.next.render());

      return $(this.el);
    }

  });



/*
  Tags
*/

  var TagsSearchView = Backbone.View.extend({
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

  var TagsView = Backbone.View.extend({
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

  var SearchSearchView = Backbone.View.extend({
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

  var SearchNextView = Backbone.View.extend({
    template: _.template($('#timeline-next').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize: function(){
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

  var SearchView = Backbone.View.extend({
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

      this.views.search.fetch();
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

  var Router = Backbone.Router.extend({

    initialize: function() {
      var profile = app.views.profile = new ProfileView({
        model : new ProfileModel()
      });
      $('#profileContent').html(profile.render());
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
      console.log(action);
      this.selectMenu('timeline');
      if(!app.views.timeline) {
        var timelinecollection = new StatusCollection();
        timelinecollection.url = '/tatami/rest/statuses/home_timeline';
        var timeline = app.views.timeline = new TimeLinePanelView({
          model: timelinecollection
        });
        app.on('refreshTimeline', function(){timeline.trigger('new');});
      }
      $('#tab-content').html(app.views.timeline.render());
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
      $('#tab-content').html(app.views.favoris.render());
    },

    tags: function(tag) {
      this.selectMenu('tags');
      var tags = app.views.tags = new TagsView({
        tag: tag
      });
      $('#tab-content').html(app.views.tags.render());
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
        $('#tab-content').html(app.views.search.render());
      }
    }

  });

  app.router = new Router();
  Backbone.history.start();


});