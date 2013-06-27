/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
(function(window, Backbone, $, _){
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

app.View.TabSearch = Backbone.View.extend({
    templateSearch: _.template($('#search-filter').html()),
    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new app.View.Tab({
            collection : this.collection,
            ViewModel : this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    events:{
        'keyup :input#block_filter':'search'
    },

    search: function(e){
        var input = e.target.value;
        if(input != '') {
            this.collection.reset();
            this.collection.search(input);
        }
    },

    selectMenu: function(menu) {
        this.$el.find('ul.nav.nav-tabs a').parent().removeClass('active');
        this.$el.find('ul.nav.nav-tabs a[href="#/' + menu + '"]').parent().addClass('active');
    },

    render: function(){
        this.$el.empty();
        this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.templateSearch());
        this.$el.append(this.views.tab.render());
        this.delegateEvents();
        return this.$el;
    }
});

app.View.TabContainer = Backbone.View.extend({
    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new app.View.Tab({
            collection : this.collection,
            ViewModel : this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    selectMenu: function(menu) {
        this.$el.find('ul.nav.nav-tabs a').parent().removeClass('active');
        this.$el.find('ul.nav.nav-tabs a[href="#/' + menu + '"]').parent().addClass('active');
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
        this.$el.addClass('table');
        this.template = this.options.template;
        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.addItem, this);
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
        this.collection.forEach(this.addItem, this);
        this.delegateEvents();
        return this.$el;
    }
});

app.Collection.TabUser = new CTabUser();

    app.View.User = Backbone.View.extend({
    initialize: function(){
        app.views = {};
    },

    template:_.template($('#users-item').html()),
    tagName: 'tr',

    events:{
    },

    renderFollow: function(){
        var user = this.model.get('username');
        var self = this;

        function onFinish(follow) {
            app.views.followButton = new app.View.FollowButtonView({
                username: user,
                followed: follow,
                owner: (user === username)
            });
            self.$el.find('.follow').html(app.views.followButton.render());
        }

        var followed = this.model.get('followed');
        if(typeof followed === 'undefined')
            $.get('/tatami/rest/friendships', {screen_name:user}, onFinish, 'json');
        else onFinish(followed);
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.renderFollow();
        this.delegateEvents();
        return this.$el;
    }
});

app.Model.FollowUserModel = new MFollowUser();

app.Model.UnFollowUserModel = new MUnFollowUser();

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
        window.location = '/tatami/account/#/profile';
    },

    follow: function() {
        var self = this;
        this.undelegateEvents();
        $(this.el).empty();

        var m = new MFollowUser();
        m.set('username', this.options.username);

        m.save(null, {
            success: function(){
                self.set(self.options.owner, true);
                self.delegateEvents();
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

        var m = new MUnFollowUser();
        m.set('username', this.options.username);

        m.save(null, {
            success: function(){
                self.set(self.options.owner, false);
                self.delegateEvents();
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
     Tags
     */

app.Collection.TabTag = Backbone.Collection.extend({
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/tagmemberships/list',
            recommended: '/tatami/rest/tags/popular',
            search: '/tatami/rest/search/tags'
        };
    },
    recommended: function(){
        this.url = this.options.url.recommended;
        this.parse = function(tags){
            return tags.filter(function(tag){
                return !(tag.followed);
            });
        };
        this.reset();
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.parse = function(tags){
            return tags;
        };
        this.reset();
        this.fetch();
    },

    search: function(query){
        this.url = this.options.url.search;
        this.reset();
        this.fetch({
            data:{
                q:query
            }
        })
    }
});

app.View.Tag = Backbone.View.extend({
    initialize: function(){
        this.model.bind('change', this.render, this);

    },

    template:_.template($('#tags-item').html()),
    tagName: 'tr',

    events:{
        'click': 'show',
        'click .follow': 'follow'
    },

    follow: function(){
        var self = this;
        var m;
        if(this.model.get('followed')){
            m = new app.Model.UnFollowTagModel(this.model.toJSON());
        }
        else {
            m = new app.Model.FollowTagModel(this.model.toJSON());
        }
        m.save(null, {
            success : function(){
                self.model.set('followed', !self.model.get('followed'));
                self.render();
            }
        });
    },

    show: function(){

    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});



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

app.Model.Group = Backbone.Model.extend({
    urlRoot: '/tatami/rest/groups',
    idAttribute: 'groupId',
    defaults: {
        name: '',
        description: '',
        publicGroup: true,
        archivedGroup: false
    }
});

app.Collection.AdminGroup = Backbone.Collection.extend({
    model : app.Model.Group,
    url: '/tatami/rest/admin/groups'
});

app.View.AddGroup = Backbone.View.extend({
    tagName: 'form',

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Group();
        this.$el.html(this.template(this.model.toJSON()));
    },

    template:_.template($('#groups-form').html()),

    events:{
        'click .show': 'toggle',
        'submit': 'submit',
        'reset': 'toggle'
    },

    toggle: function(){
        this.$el.find('fieldset').toggle();
    },

    render: function(){
        this.delegateEvents();
        return this.$el;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('name', form.find('[name="name"]').val());
        this.model.set('description', form.find('[name="description"]').val());
        this.model.set('publicGroup', form.find('[name="publicGroup"]:checked').val() === 'public');

        var self = this;
        self.model.save(null, {
            success: function(){
                $(e.target)[0].reset();
                self.$el.find('.return').append($('#form-success').html());
                self.trigger('success');
            },
            error: function(){
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.Collection.TabGroup = Backbone.Collection.extend({
    model : app.Model.Group,
    initialize: function(){
        this.options= {};
        this.options.url = {
            owned: '/tatami/rest/groups',
            recommended: '/tatami/rest/groupmemberships/suggestions',
            search: '/tatami/rest/search/groups'
        };
    },
    recommended: function(){
        this.url = this.options.url.recommended;
        this.parse = function(data, options){
            return data.filter(function(model){
                return model.publicGroup;
            });
        };
        this.fetch();
    },
    owned: function(){
        this.url = this.options.url.owned;
        this.parse = function(data, options){
            return data;
        };
        this.fetch();
    },
    search: function(query){
        this.url = this.options.url.search;
        this.fetch({
            data:{
                q: query
            }
        })
    }
});

app.View.Group = Backbone.View.extend({
    initialize: function(){
        this.actionsView = new app.View.ActionsGroup({
            model : this.model
        });
        this.actionsView.render();
    },

    template:_.template($('#groups-item').html()),
    tagName: 'tr',

    events:{
    },

    render: function(){
        var self = this;

        var data = this.model.toJSON();
        this.$el.html(this.template(data));
        this.$el.append(this.actionsView.$el);
        this.delegateEvents();
        return this.$el;
    }
});

app.Model.ListUserGroupModel = Backbone.Model.extend({
    idAttribute : 'username',
    defaults : {
        avatar : '',
        firstName : '',
        lastName : '',
        role : ''
    },
    toJSON : function(){
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar : (this.get('avatar'))? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg': '/img/default_image_profile.png'
        });
    }
});

app.Collection.ListUserGroupCollection = Backbone.Collection.extend({
    model : app.Model.ListUserGroupModel,
    url : function() {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});

app.View.ActionsGroup = Backbone.View.extend({
    tagName : 'td',
    template : {
        join : _.template($('#groups-join').html()),
        leave : _.template($('#groups-leave').html()),
        admin : _.template($('#groups-admin').html())
    },

    initialize : function(){
        var self = this;
        this.collection = new app.Collection.ListUserGroupCollection();
        this.collection.options = {
            groupId : this.model.id
        };
        this.collection.on('reset', this.render, this);
        this.collection.fetch({
            success: function() {
                self.render();
            }
        });

        this.actionModel = new app.Model.ListUserGroupModel({
            username : username
        });
        this.actionModel.urlRoot = function() {
            return '/tatami/rest/groups/' + self.model.id + '/members/';
        };
    },

    events : {
    },

    renderAdmin : function() {
        this.$el.html(this.template.admin(this.model.toJSON()));
        this.delegateEvents({
            'click' : 'onClickAdmin'
        });
    },

    onClickAdmin : function() {
        /*app.router.navigate('/groups/' + this.model.id, {
         trigger:true
         });*/
    },

    renderMember : function() {
        this.$el.html(this.template.leave(this.model.toJSON()));
        this.delegateEvents({
            'click' : 'onClickMember'
        });
    },

    onClickMember : function() {
        this.actionModel.destroy({
            success : _.bind(this.renderNotMember, this)
        });
    },

    renderNotMember : function() {
        if(this.model.get('publicGroup')){
            this.$el.html(this.template.join(this.model.toJSON()));
            this.delegateEvents({
                'click' : 'onClickNotMember'
            });
        }
        else {
            this.$el.empty();
        }
    },

    onClickNotMember : function() {
        this.actionModel.save(null, {
            success : _.bind(this.renderMember, this)
        });
    },

    render : function(){
        var template = null;

        var self = this;
        var isAdmin = app.collections.adminGroups.some(function(group){
            return (group.id === self.model.id);
        });
        if (isAdmin) {
            this.renderAdmin();
        } else {
            var isMember = this.collection.some(function(member){
                return (member.id === username);
            });
            var isPublic = false;
            if (this.model.get('publicGroup')){
                isPublic = true;
            }
            if (isPublic) {
                if (isMember) {
                    this.renderMember();
                } else {
                    this.renderNotMember();
                }
            }
        }
        return this;
    }
});

app.View.EditGroup = Backbone.View.extend({
    tagName: 'form',
    attributes : {
        'class' : 'form-horizontal row-fluid'
    },

    initialize: function(){
        this.model = new app.Model.Group({
            groupId: this.options.groupId
        });
        this.model.bind('change', this.render, this);
        this.model.fetch();
    },

    template:_.template($('#groups-form').html()),

    events:{
        'submit': 'submit'
    },

    render: function(){
        this.delegateEvents();
        return this.$el.html(this.template(this.model.toJSON()));
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('name', form.find('[name="name"]').val());
        this.model.set('description', form.find('[name="description"]').val());
        this.model.set('archivedGroup', form.find('[name="archivedGroup"]:checked').val() === 'true');

        var self = this;
        self.model.save(null, {
            success: function(){
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function(){
                self.$el.find('.return').append($('#form-error').html());
            }
        });
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
        avatar : '',
        firstName : '',
        lastName : '',
        role : ''
    },
    toJSON : function(){
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar : (this.get('avatar'))? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg': '/img/default_image_profile.png'
        });
    }
});

app.Collection.ListUserGroupCollection = Backbone.Collection.extend({
    model : app.Model.ListUserGroupModel,
    url : function() {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});

app.Model.UserSearch = Backbone.Model.extend({
    toString : function(){
        return this.get('username');
    },
    toLowerCase : function(){
        return this.toString().toLowerCase();
    },
    replace : function(a, b, c){
        return this.toString().replace(a, b, c);
    }
});

app.Collection.UserSearch = Backbone.Collection.extend({
    url : '/tatami/rest/users/search',

    model : app.Model.UserSearch,

    search : function(q, callback) {
        var self = this;
        this.fetch({
            data : {
                q : q
            },
            success : function(collection){
                var result = self.removeAlreadyMember();
                callback(result);
            }
        });
    },

    removeAlreadyMember : function(){
        var collectionFilter = this.options.filter;
        if(typeof collectionFilter != 'undefined'){
            return this.filter(function(result){
                var isAlreadyMember = collectionFilter.find(function(user){
                    var isEqual = user.get('username') === result.get('username');
                    return isEqual;
                });
                return !isAlreadyMember;
            });
        } else {
            return this.toArray();
        }
    }
});

app.View.AddUserGroup = Backbone.View.extend({
    tagName : 'form',
    attributes : {
        'class' : 'form-horizontal row-fluid'
    },
    initialize: function(){
        this.$el.html(this.template());
        var self = this;

        window.collection = this.collection;

        var search = new app.Collection.UserSearch();
        search.options = {
            filter : this.collection
        };
        this.$el.find('[name="username"]').typeahead({
            source : function(query, callback){
                search.search(query, function(results){
                    return callback(results);
                });
            },
            highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                var avatar =  (item.get('avatar'))? '/tatami/avatar/' + item.get('avatar') + '/photo.jpg': '/img/default_image_profile.png'
                return '<img class="avatar img-rounded img-small" src="' + avatar + '" />' + '@' + item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>';
                }) + ' - ' + item.get('firstName') + ' ' + item.get('lastName');
            }
        });
    },

    template:_.template($('#groups-form-adduser').html()),

    events:{
        'submit': 'submit'
    },

    render: function(){
        return this;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        var data = {
            'username' : form.find('[name="username"]').val()
        };

        var self = this;
        self.collection.create(data, {
            success: function(model){
                self.$el.find('.return').append($('#groups-form-adduser-success').html());
            },
            error: function(model){
                self.$el.find('.return').append($('#groups-form-adduser-error').html());
                model.destroy();
            }
        });
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
        var self = this;
        this.model = new app.Collection.DailyStatCollection();
        this.model.bind('reset', this.render, this);
        this.model.fetch({
            success: function() {
                self.render();
            }
        });
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

/**
 * Files
 */


app.View.FilesViewItem = Backbone.View.extend({
    template: _.template($('#files-item').html()),

    initialize: function(){
        this.model.bind('change', this.render, this);
    },

    tagName: 'tr',

    events:{
        'click .btn':'removeImage'
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el;
    },

    removeImage: function(){
        var self = this;
        this.model.destroy({
            success: function(){
                self.remove();
                app.trigger('refreshQuota');
                app.trigger('deleteSucess');
            },
            error: function(){
                app.trigger('deleteError');
            }
        });
    }

});

app.View.QuotaFiles = Backbone.View.extend({
    template: _.template($('#files-quota').html()),

    initialize: function(){
        this.model = new MQuota();
        this.model.bind('change', this.render, this);
        this.model.fetch();

        var self = this;

        app.on('refreshQuota', function() {
            self.model.fetch();
        });
    },

    render: function(){
        var quota = this.model.get(0);
        quota = Math.round(quota);
        this.$el.html(this.template({quota: quota}));
        return this.$el;
    }

});

app.View.FilesView = Backbone.View.extend({
    MenuTemplate: _.template($('#files-menu').html()),
    HeaderTemplate: _.template($('#files-header').html()),

    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.files = new app.View.Tab({
            collection : this.collection,
            ViewModel : app.View.FilesViewItem,
            template: this.HeaderTemplate
        });

        this.views.quota = new app.View.QuotaFiles();

        app.on('deleteSucess',function(){
            $('.file-infos').append($('#delete-file-success').html());
        });

        app.on('deleteError',function(){
            $('.file-infos').append($('#delete-file-error').html());
        });
    },

    render: function(){
        this.$el.empty();
        this.$el.append(this.MenuTemplate());
        this.$el.append(this.views.quota.render());
        this.$el.append(this.views.files.render());
        this.delegateEvents();
        return this.$el;
    }
});

/*
 Router
 */

$(function() {

 app.router = new AdminRouter();
 if( ! Backbone.History.started) Backbone.history.start();

});

})(window, Backbone, jQuery, _);