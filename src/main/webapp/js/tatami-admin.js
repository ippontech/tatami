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

/* Account profile */

app.Model.AccountProfile = Backbone.Model.extend({
    url: '/tatami/rest/account/profile',
    idAttribute: 'username'
});

app.View.AccountProfile = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-profile').html()),

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model.fetch({
            success:_.bind(this.render, this)
        });
    },

    events: {
        'submit': 'saveForm'
    },

    render: function(){
        this.$el.empty();

        this.$el.html(this.template({
            user: this.model.toJSON(),
            login: window.login
        }));
        this.delegateEvents();
        return this.$el;
    },

    saveForm: function(e){
        e.preventDefault();
        var self = this;

        _.each($(e.target).serializeArray(), function(value){
            self.model.set(value.name, value.value);
        });

        self.model.save(null, {
            success: function(){
                self.render();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function(){
                self.render();
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.View.AccountProfileDestroy = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-destroy').html()),

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');
    },

    events: {
        'submit': 'destroy'
    },

    render: function(){
        this.$el.empty();

        this.$el.html(this.template({
            user: this.model.toJSON(),
            login: window.login
        }));
        this.delegateEvents();
        return this.$el;
    },

    destroy: function(e){
        e.preventDefault();
        var self = this;

        self.model.destroy({
            success: function(){
                self.$el.find('.return').append($('#form-success').html());
                _.delay(_.bind(window.location.reload, window), 5000);
            },
            error: function(){
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.Model.Preferences = Backbone.Model.extend({
    url: '/tatami/rest/account/preferences'
});

app.View.Preferences = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-preferences').html()),

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Preferences();
        this.model.fetch({
            success:_.bind(this.render, this)
        });
    },

    events: {
        'submit': 'submit', 
        'change [name="theme"]' : function(e){this.switchTheme($(e.target).val());}
    },

    switchTheme: function(theme){
        var css = $('[href^="/css/themes/"]');
        css.attr('href', '/css/themes/' + theme + '.css');
    },

    render: function(){
        this.$el.empty();

        this.$el.html(this.template({
            preferences: this.model.toJSON()
        }));
        this.delegateEvents();
        return this.$el;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('theme', form.find('[name="theme"]').val());
        this.model.set('mentionEmail', form.find('[name="mentionEmail"]')[0].checked);


        var self = this;
        self.model.save(null, {
            success: function(){
                self.render();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function(){
                self.render();
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.Model.Password = Backbone.Model.extend({
    url: '/tatami/rest/account/password'
});

app.View.Password = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-password').html()),

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Password();
        this.model.fetch({
            error:_.bind(this.disable, this)
        });
        
        this.$el.empty();

        this.$el.html(this.template());
    },

    events: {
        'submit': 'submit',
        'change [name="newPassword"]' : 'validation',
        'change [name="newPasswordConfirmation"]' : 'validation'
    },

    disable: function(){
        this.$el.find('[name]').attr('disabled', 'disabled');
        this.$el.find('button[type="submit"]').attr('disabled', 'disabled');
        this.$el.find('.return').append($('#form-ldap').html());
    },

    validation: function(){
        var newPassword = this.$el.find('[name="newPassword"]');
        var newPasswordConfirmation = this.$el.find('[name="newPasswordConfirmation"]');
        if(newPassword.val() !== newPasswordConfirmation.val()){
            newPasswordConfirmation[0].setCustomValidity($('#account-password-newPasswordConfirmation').text());
            return;
        }
        newPasswordConfirmation[0].setCustomValidity("");
        return;
    },

    render: function(){

        this.delegateEvents();
        return this.$el;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('oldPassword', form.find('[name="oldPassword"]').val());
        this.model.set('newPassword', form.find('[name="newPassword"]').val());
        this.model.set('newPasswordConfirmation', form.find('[name="newPasswordConfirmation"]').val());

        var self = this;
        self.model.save(null, {
            success: function(){
                $(e.target)[0].reset();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function(){
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.View.TabContainer = Backbone.View.extend({
    initialize: function(){
        this.views = {};

        this.views.tab = new app.View.Tab({
            model : this.model,
            ViewModel : this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        })
    },

    render: function(){
        this.$el.empty();
        this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.views.tab.render());

        this.delegateEvents();
        return this.$el;
    }
});

app.View.Tab = Backbone.View.extend({
    initialize: function() {
        this.template = this.options.template;
        this.model.bind('reset', this.render, this);
        this.model.bind('add', this.addItem, this);
    },

    tagName: 'table',

    addItem: function(item) {
        this.$el.append(new this.options.ViewModel({
            model: item
        }).render());
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
        _.each(this.model.models, this.addItem, this);
        this.delegateEvents();
        return this.$el;
    }
});

app.Collection.TabUser = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/users/suggestions',
            popular: '/tatami/rest/users'
        }
    },
    popular: function(){
        this.url = this.options.url.popular;
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.fetch();
    }
});

app.View.User = Backbone.View.extend({
    initialize: function(){

    },

    template:_.template('<td><@= username @></td><td><@= firstName @></td>'),
    tagName: 'tr',

    events:{
        'click': 'show'
    },

    show: function(){
        console.log(this.model.toJSON());
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});

app.Collection.TabTag = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/tagmemberships/list',
            popular: '/tatami/rest/tags/popular'
        }
    },
    popular: function(){
        this.url = this.options.url.popular;
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.fetch();
    }
});

app.View.Tag = Backbone.View.extend({
    initialize: function(){

    },

    template:_.template('<td><@= name @></td>'),
    tagName: 'tr',

    events:{
        'click': 'show'
    },

    show: function(){
        console.log(this.model.toJSON());
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});

app.Collection.TabGroup = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/groups',
            popular: '/tatami/rest/groupmemberships/suggestions'
        }
    },
    popular: function(){
        this.url = this.options.url.popular;
        this.parse = function(response){
            return response;
        }
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.parse = function(response){
            var admin = response.groupsAdmin;
            var groups = response.groups;

            groups.forEach(function(group){
                group.admin = _.some(admins, function(admin){
                    return ( group.groupId === admin.groupId );
                })
            });
            return groups;
        }
        this.fetch();
    }
});

app.View.Group = Backbone.View.extend({
    initialize: function(){

    },

    template:_.template('<td><@= name @></td><td><@= count @></td>'),
    tagName: 'tr',

    events:{
        'click': 'show'
    },

    show: function(){
        console.log(this.model.toJSON());
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});

/*
 Statistics
 */

app.Collection.DailyStatCollection = Backbone.Collection.extend({
    url:'/tatami/rest/stats/day'
});

app.View.DailyStatsView = Backbone.View.extend({
    initialize:function () {
        this.model = new app.Collection.DailyStatCollection();
        this.model.bind('reset', this.render, this);
        this.model.fetch();


        $(window).bind("resize.app", _.bind(this.render, this));
    },

    render:function () {

        var values = [];
        var labels = [];
        this.model.each(function (model) {
            values.push(model.get('statusCount'));
            labels.push(model.get('username'));
        });

        this.$el.pie(values, labels);

        return this.$el;
    }
});

/*
 Router
 */

app.Router.AdminRouter = Backbone.Router.extend({
    
    initialize: function(){
        this.views = [];
    },
    
    selectMenu: function(menu) {
        $('.adminMenu a').parent().removeClass('active');
        $('.adminMenu a[href="/tatami/account/#/' + menu + '"]').parent().addClass('active');
    },

    resetView : function(){
        this.views = [];
        $('#accountContent').empty();
    },

    addView : function(view){
        this.views.push(view);
        $('#accountContent').append(view.$el);
        view.render();
    },

    routes: {
        'profile': 'profile',
        'preferences': 'preferences',
        'password': 'password',
        'groups': 'groups',
        'groups/popular': 'popularGroups',
        'tags':'tags',
        'tags/popular':'popularTags',
        'users':'users',
        'users/popular':'popularUsers',
        'status_of_the_day' : 'status_of_the_day',
        '*action': 'profile'
    },

    profile: function() {
        this.selectMenu('profile');

        if(!app.views.profile){
            var model = new app.Model.AccountProfile();
            app.views.profile = {};
            app.views.profile.edit = new app.View.AccountProfile({
                model: model
            });
            app.views.profile.destroy = new app.View.AccountProfileDestroy({
                model: model
            });
        }

        this.resetView();
        this.addView(app.views.profile.edit);
        this.addView(app.views.profile.destroy);
    },

    preferences: function(){
        this.selectMenu('preferences');

        if(!app.views.preferences){
            app.views.preferences = new app.View.Preferences();
        }

        this.resetView();
        this.addView(app.views.preferences);
    },

    password: function(){
        this.selectMenu('password');

        if(!app.views.password){
            app.views.password = new app.View.Password();
        }

        this.resetView();
        this.addView(app.views.password);
    },

    initGroups: function(){
        if(!app.views.groups)
            app.views.groups = new app.View.TabContainer({
                model: new app.Collection.TabGroup(),
                ViewModel: app.View.Group,
                MenuTemplate: _.template('<a href ="#/groups">Groups</a><a href ="#/groups/popular">Popular</a>'),
                TabHeaderTemplate :_.template('<tr><td>Name</td></tr>')
            });
        return app.views.groups;
    },
    
    groups: function(){
        var view = this.initGroups();
        this.selectMenu('groups');

        view.model.owned();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },
    
    popularGroups: function(){
        var view = this.initGroups();
        this.selectMenu('groups');

        view.model.popular();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },

    initTags: function(){
        if(!app.views.tags)
            app.views.tags = new app.View.TabContainer({
                model: new app.Collection.TabTag(),
                ViewModel: app.View.Tag,
                MenuTemplate: _.template('<a href ="#/tags">Tags</a><a href ="#/tags/popular">Popular</a>'),
                TabHeaderTemplate :_.template('<tr><td>Name</td></tr>')
            });
        return app.views.tags;
    },

    tags: function(){
        var view = this.initTags();
        this.selectMenu('tags');

        view.model.owned();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },

    popularTags: function(){
        var view = this.initTags();
        this.selectMenu('tags');

        view.model.popular();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },

    initUsers: function(){
        if(!app.views.users)
            app.views.users = new app.View.TabContainer({
                model: new app.Collection.TabUser(),
                ViewModel: app.View.User,
                MenuTemplate: _.template('<a href ="#/users">Users</a><a href ="#/users/popular">Popular</a>'),
                TabHeaderTemplate :_.template('<tr><td>Username</td><td>Firstname</td></tr>')
            });
        return app.views.users;
    },
    
    users: function(){
        var view = this.initUsers();
        this.selectMenu('users');

        view.model.owned();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },
    
    popularUsers: function(){
        var view = this.initUsers();
        this.selectMenu('users');

        view.model.popular();

        if(this.views.indexOf(view)===-1){
            this.resetView();
            this.addView(view);
        }
    },

    status_of_the_day: function(){
        this.selectMenu('status_of_the_day');
        if(!app.views.daily)
            app.views.daily = new app.View.DailyStatsView();
        var view = app.views.daily;

        this.resetView();
        this.addView(view);
    }
    
});



$(function() {
    
    app.router = new app.Router.AdminRouter();
    Backbone.history.start();

});
