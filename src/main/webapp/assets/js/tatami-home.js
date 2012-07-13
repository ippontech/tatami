
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

      $(this.el).append($(this.views.info.render()));
      $(this.el).append($(this.views.stats.render()));
      $(this.el).append($(this.views.update.render()));

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
    newStatus: function(done, context){
      if(this.models.length === 0)
        this.fetch({
          success: function(){
            done.call(context);
          },
          error: function() {
            done.call(context);
          }
        });
      else{
        var self = this;

        var sc = _.clone(this);
        sc.fetch({
          data: {
            since_id: _.first(self.models).get('statusId')
          },
          success: function(){
            sc.models.reverse()
            _.each(sc.models, function(model, key) {
              self.unshift(model);
            });
            done.call(context);
          },
          error: function() {
            done.call(context);
          }
        });
      }
    },

    nextStatus: function(done, context){
      var self = this;
      if(this.models.length === 0)
        this.fetch({
          success: function(){
            if(self.models.length > 0)
              done.call(context);
            else
              context.remove();
          },
          error: function() {
            done.call(context);
          }
        });
      else{
        var self = this;
        var sc = _.clone(this);
        sc.fetch({
          data: {
            max_id: _.last(self.models).get('statusId')
          },
          success: function(){
            _.each(sc.models, function(model, key) {
              self.push(model);
            });
            if(sc.length > 0)
              done.call(context);
            else
              context.remove();
          },
          error: function() {
            done.call(context);
          }
        });
      }
    }
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

    newStatus: function(){
      this.progress();
      this.model.newStatus(this.render, this);
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
  Initialisation
*/

  var profile = app.views.profile = new ProfileView({
    model : new ProfileModel()
  });
  $('#profileContent').html($(profile.render()));

  var timelinecollection = new StatusCollection();
  timelinecollection.url = '/tatami/rest/statuses/home_timeline';
  var timeline = app.views.timeline = new TimeLinePanelView({
    model: timelinecollection
  });
  $('#timeline').html($(timeline.render()));
  app.on('refreshTimeline', function(){timeline.trigger('new');});

  /*var favoriscollection = new StatusCollection();
  favoriscollection.url = '/tatami/rest/favorites';
  var favoris = app.views.favoris = new TimeLinePanelView({
    model: favoriscollection
  });
  $('#favoris').html($(favoris.render()));*/


});