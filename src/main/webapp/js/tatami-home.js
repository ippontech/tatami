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

/*
  Profile
*/

app.View.ProfileInfoView = Backbone.View.extend({
  template: _.template($('#profile-infos-template').html()),

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
  template: _.template($('#profile-stats-template').html()),

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
  inSearchMode: false,
  searchChar: '',

  initialize: function() {
      this.$el.addClass('row-fluid');
      this.groupsCollection = new app.Collection.GroupsCollection();
      this.groupsCollection.fetch();
      this.groupsCollection.bind("reset", this.render, this);
  },

  events: {
    'submit': 'addStatus',
    'change #updateStatusContent': 'storeStatus',
    'change #updateStatusGroup': 'storeStatus',
    'change #statusPrivate': 'storeStatus'
  },

  storeStatus: function(e){
      var elem = e.target.id

          if(elem == 'updateStatusContent'){
              window.localStorage.setItem('status', e.target.value);
          } else if(elem == 'updateStatusGroup'){
              window.localStorage.setItem('statusGroup', e.target.value);
          } else if(elem == 'statusPrivate'){
              window.localStorage.setItem('statusPrivate', e.target.checked);
          }
  },

  addStatus: function(e) {
    var self = this;
    e.preventDefault();
    this.disable();

    var status = new app.Model.StatusUpdateModel();
    status.set("attachmentIds", []);
    _.each($(e.target).serializeArray(), function(data) {
      if (data.name == "attachmentIds[]") {
          status.get("attachmentIds").push(data.value);
      } else {
        status.set(data.name, data.value);
      }
    });
    status.save(null,{
      success: function(model, response) {
          window.localStorage.removeItem('status');
          window.localStorage.removeItem('statusGroup');
          window.localStorage.removeItem('statusPrivate');
          $("#statusPrivate").attr('checked', false);
          e.target.reset();
          $(self.el).find('.control-group').removeClass('error');
          $('#updateStatusEditorTab a[href="#updateStatusEditPane"]').tab('show');
          $("#updateStatusContent").css("height", "20px");
          $("#contentGroup").hide();
          $("#updateStatusEditorTab").hide();
          $("#dropzone").hide();
          $("#fileUploadResults").empty();
          $("#updateStatusPrivate").hide();
          $("#updateStatusBtns").hide();
          $("#statusUpdate").popover({placement: 'bottom'});
          $("#statusUpdate").popover('show');
          $("#updateStatusContent").change();
          app.trigger('refreshProfile');
          app.trigger('refreshTimeline');
          setTimeout(function () {
              $("#statusUpdate").popover('hide');
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
    var currentGroup = Backbone.history.fragment.split('/').slice(-1);

    $el.html(this.template({
        groupsCollection: this.groupsCollection}));

      $("#updateStatusContent").click(function () {
          if($(this).css("height") == "30px"){
              $(this).css("height", "150px");
              $("#updateStatusPreview").css("height", "150px");
              $("#updateStatusEditorTab").fadeIn();
              $("#contentGroup").fadeIn();
              $("#contentGroup #updateStatusGroup").val(currentGroup);
              $("#updateStatusPrivate").fadeIn();
              $("#updateStatusBtns").fadeIn();
              $("#dropzone").fadeIn();

              $(this).val(window.localStorage.getItem('status'));
              if(currentGroup == "") {
                  $("#contentGroup #updateStatusGroup").val(window.localStorage.getItem('statusGroup'));
              }
              if (window.localStorage.getItem('statusPrivate') == "true") {
                  $("#statusPrivate").attr('checked', true);
              }
          }
      });

      $('#profileContent').mouseleave(function () {
          if ($("#updateStatusContent").val().length === 0) {
              window.localStorage.removeItem('status');
              $("#updateStatusContent").css("height", "30px");
          }
      });

      $('a[data-toggle="tab"]').on('show', function (e) {
          if (e.target.id === 'updateStatusPreviewTab') {
            $('#updateStatusPreview').html(
                marked($("#updateStatusContent").val()));
          }
      });

      $("#updateStatusContent").typeahead(new Suggester($("#updateStatusContent")));

      $("#fullSearchText").typeahead(new SearchEngine($("#fullSearchText")));

      $("#updateStatusContent").charCount({
          css:'counter',
          cssWarning:'counter_warning',
          cssExceeded:'counter_exceeded',
          allowed:750,
          warning:50,
          counterText:text_characters_left + " "
      });

      $("#updateStatusBtns").popover({
          animation:true,
          placement:'bottom',
          trigger:'manual'
      });
      $("#contentHelp").popover({
          html:true,
          animation:true,
          placement:'right'
      });
      $('#updateStatusFileupload').fileupload({
          dataType: 'json',
          sequentialUploads: 'true',
          progressall: function (e, data) {
              $('#attachmentBar').show();
              var progress = parseInt(data.loaded / data.total * 100, 10);
              $('#attachmentBar .bar').css(
                  'width',
                  progress + '%'
              );
          },
          dropZone: $('#dropzone'),
          done: function (e, data) {
              $('#attachmentBar').hide();
              $('#attachmentBar .bar').css(
                  'width','0%'
              );
              $.each(data.result, function (index, attachment) {
                  var size = "";
                  if (attachment.size < 1000000) {
                      size = (attachment.size / 1000).toFixed(0) + "K";
                  } else {
                      size = (attachment.size / 1000000).toFixed(2) + "M";
                  }
                  $("<p>" + attachment.name + " (" + size + ")" +
                      "<input type='hidden' name='attachmentIds[]' value='" + attachment.attachmentId + "'/></p>").appendTo($("#fileUploadResults"));
              });
          },
          fail: function (e, data) {
              $('#attachmentBar').hide();
              $('#attachmentBar .bar').css(
                  'width','0%'
              );
              if (data.errorThrown == "Forbidden") {
                  $("<p>Attachment failed! You do not have enough free disk space.</p>").appendTo($("#fileUploadResults"));
              }
          }
      });
      $(document).bind('dragover', function (e) {
          var dropZone = $('#dropzone'),
              timeout = window.dropZoneTimeout;
          if (!timeout) {
              dropZone.addClass('in');
          } else {
              clearTimeout(timeout);
          }
          if (e.target === dropZone[0]) {
              dropZone.addClass('hover');
          } else {
              dropZone.removeClass('hover');
          }
          window.dropZoneTimeout = setTimeout(function () {
              window.dropZoneTimeout = null;
              dropZone.removeClass('in hover');
          }, 100);
      });
      $(document).bind('drop dragover', function (e) {
          e.preventDefault();
      });
      $('#dropzone').bind('click', function(){
         $('#updateStatusFileupload').click();
      });
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

    this.render();
  },

  render: function() {
    $(this.el).empty();

    $(this.el).append(this.views.info.$el);
    $(this.el).append(this.views.stats.$el);
    $(this.el).append(this.views.update.$el);

    return $(this.el);
  }
});

/*
  Profile Follow
*/

app.View.UserFindFormView = Backbone.View.extend({
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
                return $.get('/tatami/rest/search/users', {q:query}, function (data) {
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
  template: _.template($('#profile-user-list-empty').html()),
  tagName: 'tbody',

  initialize: function() {
    var self = this;

    this.model = new app.Collection.SuggestCollection();

    this.model.bind('reset', this.render, this);
    this.model.bind('add', function(model, collection, options) {
      self.addItem(model, collection.indexOf(model));
    }, this);

    this.model.fetch();
  },

  render: function() {
    $(this.el).empty();
    if(this.model.length > 0) {
      this.model.forEach(this.addItem, this);}
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
  template: _.template($('#profile-user-list-item').html()),


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
        this.views.suggest = new app.View.SuggestView();
        this.render();
    },

    render: function() {
        $(this.el).empty();
        $(this.el).append(this.template());
        $(this.el).find('#follow-suggest').append(this.views.suggest.$el);

        return $(this.el);
    }
});

/*
  Mentions
 */
app.View.MentionView = Backbone.View.extend({
    template: _.template($('#mention-refresh').html()),
    progressTemplate: _.template($('#timeline-progress').html()),

    initialize:function () {
        this.views = {};

        this.views.list = new app.View.TimeLineView({
            model:this.model
        });

        this.views.next = new app.View.TimeLineNextView({
            model:this.model
        });

        this.views.next.nextStatus();
    },

    events: {
       'click #mentionRefresh': 'refreshMention'
    },

    refreshMention: function(done, context){
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
        $(this.el).html(this.template());
        $(this.el).append(this.views.list.render());
        $(this.el).append(this.views.next.render());
        this.delegateEvents();
        return $(this.el);
    },

    progress: function() {
        $(this.el).html(this.progressTemplate());
        this.undelegateEvents();
        return $(this.el);
    }

});

app.View.MentionPanelView = Backbone.View.extend({

    initialize: function(){
        this.views = {};
        this.views.mentionView = new app.View.MentionView({
            model : this.model
        });

        this.views.mentionView.refreshMention();

        this.on('refresh', this.views.mentionView.refreshMention, this.views.mentionView);
    },

    render: function() {
        $(this.el).append(this.views.mentionView.render());
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

    this.on('refresh', this.views.refresh.refreshStatus, this.views.refresh);

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
Groups
 */

app.View.GroupsListView = Backbone.View.extend({
    template: _.template($('#group-list').html()),

    tagName: 'div',

    initialize: function(){
        this.groupsCollection = new app.Collection.GroupsCollection();
        this.groupsCollection.bind("reset", this.render, this);
        this.groupsCollection.fetch();

        var self = this;
    },

    render: function() {
        $(this.el).html(this.template({
            groupsCollection: this.groupsCollection}));
        return $(this.el);
    }

});

app.Collection.GroupsCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/groupmemberships/lookup?screen_name=' + username;
    }
});

app.Model.GroupModel = Backbone.Model.extend({
    url : function() {
        return '/tatami/rest/groups/' + this.groupId;
    }
});

app.View.GroupDetailsView = Backbone.View.extend({
    template: _.template($('#group-details').html()),

    initialize:function () {
        var self = this;
        this.model.groupId = this.options.groupId;
        this.model.fetch({
          success: function(){
            self.render();
          }
        });
        $("#groupsList li").removeClass("active");
        $("#group-list-" + this.model.groupId).addClass("active");

        this.views = {};

        var collection = new app.Collection.ListUserGroupCollection();
        collection.options = {
            groupId : this.options.groupId
        };

        this.views.memberList = new app.View.ListUserGroup({
            collection : collection,
            groupId : this.options.groupId,
            admin : false
        });

        this.views.buttonJoin = new app.View.ButtonJoinGroup({
          groupId : this.options.groupId
        });
    },

    render: function() {
        $(this.el).html(this.template({
            group: this.model}));

        this.$el.find('#group-list-member .modal-body').html(this.views.memberList.el);

        this.views.memberList.collection.fetch();

        this.$el.find('.bouton-join-group').append(this.views.buttonJoin.el);

        return $(this.el);
    }
});

app.View.ButtonJoinGroup = Backbone.View.extend({
  tagName : 'button',
  attributes: {
    class: 'btn'
  },
  template : {
    join: _.template($('#button-join-group-join').html()),
    left: _.template($('#button-join-group-left').html()),
    admin: _.template($('#button-join-group-admin').html())
  },
  initialize: function(){
    var self = this;

    this.model = new app.Model.ListUserGroupModel();
    this.model.options = {
      groupId : this.options.groupId,
      username : username
    };
    this.model.url = function(){
      return "/tatami/rest/groups/" + this.options.groupId + "/members/" + this.options.username;
    };

    window.model = this.model;

    this.model.fetch({
      success: function(model){
        self.render();
      }
    });
  },

  events : {
    'click': 'onClick'
  },

  onClick: function(e){
    var self = this;
    if (this.model.get('role') === 'ADMIN') {
      window.location.href = '/tatami/account/#/groups/' + this.options.groupId;
      return;
    }
    if (this.model.get('isMember')){
      this.model.destroy({
        success: function(){
          self.model.set('isMember', false);
          self.render();
        }
      });
    }
    else {
      this.model.save(null, {
        success: function(){
          self.model.set('isMember', true);
          self.render();
        }
      });
    }
  },

  render: function(){
    if (this.model.get('role') === 'ADMIN') {
      this.$el.addClass('btn-primary');
      this.$el.text(this.template.admin());
    }
    else {
      if (this.model.get('isMember')) {
        this.$el.addClass('btn-danger');
        this.$el.text(this.template.left());
      }
      else {
        this.$el.removeClass('btn-danger');
        this.$el.text(this.template.join());
      }
    }

    return this;
  }
});

app.View.GroupsView = Backbone.View.extend({
    initialize:function () {
        this.views = {};

        this.groupId = this.options.group;
        this.model = new app.Collection.StatusCollection();
        this.model.url = '/tatami/rest/statuses/group_timeline?groupId=' + this.groupId;

        this.views.groupDetails = new app.View.GroupDetailsView({
            model: new app.Model.GroupModel(),
            groupId: this.groupId
        });

        this.views.list = new app.View.TimeLineView({
            model: this.model
        });

        this.views.next = new app.View.TimeLineNextView({
            model: this.model
        });
        this.views.next.nextStatus();
    },

    render:function () {
        $(this.el).append(this.views.groupDetails.$el);
        $(this.el).append(this.views.list.render());
        $(this.el).append(this.views.next.render());
        return $(this.el);
    }

});

/*
Tags
*/

app.View.TagsSearchView = Backbone.View.extend({
  tagfollow: _.template($('#tag-search-form-follow').html()),
  tagfollowed: _.template($('#tag-search-form-followed').html()),

  tagName: 'form',

  events: {
    'submit': 'submit',
    'click #tag-follow': 'follow',
    'click #tag-followed': 'unfollow'
  },

  initialize: function(){

    $(this.el).addClass('alert alert-status');

    var self = this;
    this.model.url = function() {
      if(self.options.tag && self.options.tag !== '')
        return '/tatami/rest/statuses/tag_timeline?tag=' + self.options.tag;
      else
        return '/tatami/rest/statuses/tag_timeline';
    };

    this.set(this.options.tag);
  },

  submit: function(e) {
    e.preventDefault();

    var self = this;

    _.each($(this.el).serializeArray(), function(input) {
      if (input.name === 'search') {
        self.options.tag = self.escapeField(input.value + '');
      }
    });

    this.search();
  },
  escapeField: function (value) {
    return value.replace(new RegExp('["\'<>]', 'gi'), '');
  },
  search: function () {
    app.router.navigate('//tags/' + this.options.tag, {trigger: false,replace:false});
    this.fetch();
  },

  fetch : function() {
    this.model.fetch();
  },

  set: function(tag) {

    var _this = this;

    if(typeof tag === 'undefined' || tag === ''){
      this.emptyRender();

    }else {

      return $.get('/tatami/rest/tagmemberships/lookup', {tag_name:tag}, function (data) {
        var followed = data.followed;
        if(followed) {
          _this.followedRender();
        }
        else if(!followed) {
          _this.followRender();
        }
      });
    }
  },

  follow: function(){

    var _this = this;
    this.undelegateEvents();

    var m = new app.Model.FollowTagModel();
    m.set('name', this.options.tag);

    m.save(null, {
      success: function(){
        _this.set(_this.options.tag);
        _this.delegateEvents();
      },
      error: function(){
        _this.delegateEvents();
      }
    });
  },

  unfollow: function(){

    var _this = this;
    this.undelegateEvents();

    var m = new app.Model.UnFollowTagModel();
    m.set('name', this.options.tag);

    m.save(null, {
      success: function(){
        _this.set(_this.options.tag);
        _this.delegateEvents();
      },
      error: function(){
        _this.delegateEvents();
      }
    });
  },

  followedRender: function() {
    $(this.el).html(this.tagfollowed({tag: this.options.tag}));
  },

  followRender: function() {
    $(this.el).html(this.tagfollow({tag: this.options.tag}));
  },
  emptyRender: function(){
    $(this.el).html(this.tagfollow());
  },

  render: function () {
    var trends = new app.View.TrendsView();

    if(this.model.fetch().length > 0)
    {
      $(this.el).append(trends.$el);
    }

    return $(this.el);
  }

});


app.View.TagsRefreshView = Backbone.View.extend({
  template: _.template($('#tag-refresh').html()),
  progressTemplate: _.template($('#timeline-progress').html()),

  initialize: function(){

  },

  events: {
    'click': 'refreshTags'
  },

  refreshTags: function(){
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


app.View.TagsView = Backbone.View.extend({

    initialize:function () {
        this.views = {};

        this.model = new app.Collection.StatusCollection();

        this.views.refresh = new app.View.TagsRefreshView({
          model:this.model
        });

        this.views.search = new app.View.TagsSearchView({
            tag:this.options.tag,
            model:this.model
        });

        this.views.list = new app.View.TimeLineView({
            model:this.model
        });

        this.views.next = new app.View.TimeLineNextView({
            model:this.model
        });

        this.views.next.nextStatus();
    },

    render:function () {
      $(this.el).append(this.views.refresh.render());
        $(this.el).append(this.views.search.render());
        $(this.el).append(this.views.list.render());
        $(this.el).append(this.views.next.render());
        return $(this.el);
    }

});


/*
Search
*/

app.View.SearchSearchView = Backbone.View.extend({

  inSearchMode: false,
  searchChar: '',
  template: _.template($('#search-search-form').html()),

  tagName: 'form',

  events: {
    'submit': 'submit'
  },

  initialize: function(){
    $(this.el).addClass('alert alert-status');
  },

  submit: function(e) {
    e.preventDefault();

    var self = this;

    _.each($(this.el).serializeArray(), function(input) {
      if (input.name === 'search') {
        self.model.options.search = self.escapeField(input.value + '');
      }
    });

    this.search();
  },

  search: function () {
    app.router.navigate('//search/status/' + this.model.options.search, {trigger: false,replace:false});
    this.fetch();
  },
  escapeField: function (value) {
      return value.replace(new RegExp('["\'<>]', 'gi'), '');
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
  var search = this.escapeField((typeof this.model.options.search === 'undefined')? '':this.model.options.search);
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
    sc.url = '/tatami/rest/search/status';

    sc.fetch({
      data: {
        q: this.model.options.search,
        page: this.model.options.page,
        rpp: this.model.options.rpp
      },
      success: function(){
        self.model.options.page++;
        sc.forEach(self.model.push, self.model);
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

    this.model.url = '/tatami/rest/search/status';
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
Initialization
*/

app.Router.HomeRouter = Backbone.Router.extend({

  initialize:function () {
      var profile = app.views.profile = new app.View.ProfileView({
          model:new app.Model.ProfileModel()
      });
      $('#profileContent').html(profile.$el);
      var groupList = new app.View.GroupsListView();
      $('#userGroups').html(groupList.$el);

      var follow = app.views.follow = new app.View.FollowView();
      $('#profileFollow').html(follow.$el);

      var trends = new app.View.TrendsView();
      $('#trends').html(trends.$el);
  },

  selectMenu: function(menu) {
    $('.homeMenu a').parent().removeClass('active');
    $('.homeMenu a[href="#/' + menu + '"]').parent().addClass('active');
  },

  routes: {
    "timeline": "timeline",
    "mention": "mention",
    "groups": "groups",
    "groups/*group": "groups",
    "tags": "tags",
    "tags/*tag": "tags",
    "favorite": "favorite",
    "search": "search",
    "search/status/*search": "search",
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

    mention:function () {
        this.selectMenu('mention');
        if(!app.views.mention) {
            var mentionCollection = new app.Collection.StatusCollection();
            mentionCollection.url = '/tatami/rest/mentions';
            app.views.mention = new app.View.MentionPanelView({
                model: mentionCollection
            });
        }
        app.views.mention.trigger('refresh');
        $('#tab-content').empty();
        $('#tab-content').append(app.views.mention.render());
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

    groups: function(group) {
        this.selectMenu('groups');
        app.views.groups = new app.View.GroupsView({
            group: group
        });
        $('#tab-content').empty();
        $('#tab-content').append(app.views.groups.render());
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
        search: search,
        rpp: 19
      });
      $('#tab-content').empty();
      $('#tab-content').append(app.views.search.render());
    }
  }
});

$(function() {

  app.router = new app.Router.HomeRouter();

  if (isNew){
          app.views.welcome = new app.View.Welcome();
          $('body').append(app.views.welcome.$el);
  }

  Backbone.history.start();

});
