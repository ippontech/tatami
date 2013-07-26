
var VAddGroup = Marionette.ItemView.extend({
    tagName: 'form',

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new MGroup();
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
                //self.$el.find('.return').append($('#form-success').html());
                app.trigger('even-alert-success', app.formSuccess);
                self.trigger('success');
            },
            error: function(){
                //self.$el.find('.return').append($('#form-error').html());
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});

var VGroup = Marionette.ItemView.extend({
    initialize: function(){
        this.actionsView = new VActionsGroup({
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

var VActionsGroup = Marionette.ItemView.extend({
    tagName : 'td',
    template : {
        join : _.template($('#groups-join').html()),
        leave : _.template($('#groups-leave').html()),
        admin : _.template($('#groups-admin').html())
    },

    initialize : function(){
        var self = this;
        this.collection = new CListUserGroup();
        this.collection.options = {
            groupId : this.model.id
        };
        this.collection.on('reset', this.render, this);
        this.collection.fetch({
            success: function() {
                self.render();
            }
        });

        this.actionModel = new MUserGroup({
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

var VEditGroup = Marionette.ItemView.extend({
    tagName: 'form',
    attributes : {
        'class' : 'form-horizontal row-fluid'
    },

    initialize: function(){
        this.model = new MGroup({
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
                //self.$el.find('.return').append($('#form-success').html());
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                //self.$el.find('.return').append($('#form-error').html());
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});

var VListUserGroup = Marionette.ItemView.extend({
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
        var view = new VListUserGroupItem(
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

var VListUserGroupItem = Marionette.ItemView.extend({
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

var VAddUserGroup = Marionette.ItemView.extend({
    tagName : 'form',
    attributes : {
        'class' : 'form-horizontal row-fluid'
    },
    initialize: function(){
        this.$el.html(this.template());
        var self = this;

        window.collection = this.collection;

        var search = new CUserSearch();
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
                //self.$el.find('.return').append($('#groups-form-adduser-success').html());
                app.trigger('even-alert-success', app.memberAddSuccess);
            },
            error: function(model){
                //self.$el.find('.return').append($('#groups-form-adduser-error').html());
                app.trigger('even-alert-error', app.memberAddError);
                model.destroy();
            }
        });
    }
});
