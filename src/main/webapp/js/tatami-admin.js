_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

var app;

if (!window.app) {
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

/* Account profile */

app.Model.AccountProfile = Backbone.Model.extend({
    url: '/tatami/rest/account/profile',
    idAttribute: 'username',
    defaults: {
        username: window.username,
        firstName: '',
        lastName: '',
        jobTitle: '',
        phoneNumber: '',
        viadeo: '',
        linkedIn: '',
        skype: '',
        twitter: '',
        facebook: '',
        googlePlus: '',
        hireDate: ''
    },
    toJSON: function () {
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar: (this.get('avatar')) ? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg' : '/img/default_image_profile.png'
        });
    },

    getAvatarURL: function () {
        return (this.get('avatar')) ? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg' : '/img/default_image_profile.png';
    }
});

app.View.AccountProfile = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-profile').html()),

    initialize: function () {
        this.$el.addClass('form-horizontal row-fluid');

        this.model.fetch({
            success: _.bind(this.render, this)
        });
    },

    events: {
        'submit': 'saveForm'
    },

    render: function () {
        this.$el.empty();
        this.$el.html(this.template({
            user: this.model.toJSON(),
            login: window.login
        }));

        $('#avatarFile').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result, function (index, avatar) {
                    $('.avatar').attr('src', '/tatami/avatar/' + avatar.attachmentId + '/');
                });
            },

            fail: function (e, data) {
                console.log(e);
            }

        });

        this.delegateEvents();
        return this.$el;
    },

    saveForm: function (e) {
        e.preventDefault();
        var self = this;

        _.each($(e.target).serializeArray(), function (value) {
            self.model.set(value.name, value.value);
        });

        self.model.save(null, {
            success: function () {
                self.render();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function () {
                self.render();
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.View.AccountProfileDestroy = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#account-destroy').html()),

    initialize: function () {
        this.$el.addClass('form-horizontal row-fluid');
    },

    events: {
        'submit': 'destroy'
    },

    render: function () {
        this.$el.empty();

        this.$el.html(this.template({
            user: this.model.toJSON(),
            login: window.login
        }));
        this.delegateEvents();
        return this.$el;
    },

    destroy: function (e) {
        e.preventDefault();
        var self = this;

        self.model.destroy({
            success: function () {
                self.$el.find('.return').append($('#form-success').html());
                _.delay(_.bind(window.location.reload, window), 5000);
            },
            error: function () {
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

    initialize: function () {
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Preferences();
        this.model.fetch({
            success: _.bind(this.render, this)
        });
    },

    events: {
        'submit': 'submit'
    },

    render: function () {
        this.$el.empty();
        this.$el.html(this.template({
            preferences: this.model.toJSON()
        }));
        this.delegateEvents();
        return this.$el;
    },

    submit: function (e) {
        e.preventDefault();

        var form = $(e.target);

        this.model.set('mentionEmail', form.find('[name="mentionEmail"]')[0].checked);
        this.model.set('dailyDigest', form.find('[name="dailyDigest"]')[0].checked);
        this.model.set('weeklyDigest', form.find('[name="weeklyDigest"]')[0].checked);
        this.model.set('rssUidActive', form.find('[name="rssUidActive"]')[0].checked);

        var self = this;
        self.model.save(null, {
            success: function () {
                self.render();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function () {
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

    initialize: function () {
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Password();
        this.model.fetch({
            error: _.bind(this.disable, this)
        });

        this.$el.empty();

        this.$el.html(this.template());
    },

    events: {
        'submit': 'submit',
        'change [name="newPassword"]': 'validation',
        'change [name="newPasswordConfirmation"]': 'validation'
    },

    disable: function () {
        this.$el.find('[name]').attr('disabled', 'disabled');
        this.$el.find('button[type="submit"]').attr('disabled', 'disabled');
        this.$el.find('.return').append($('#form-ldap').html());
    },

    validation: function () {
        var newPassword = this.$el.find('[name="newPassword"]');
        var newPasswordConfirmation = this.$el.find('[name="newPasswordConfirmation"]');
        if (newPassword.val() !== newPasswordConfirmation.val()) {
            newPasswordConfirmation[0].setCustomValidity($('#account-password-newPasswordConfirmation').text());
            return;
        }
        newPasswordConfirmation[0].setCustomValidity('');
        return;
    },

    render: function () {

        this.delegateEvents();
        return this.$el;
    },

    submit: function (e) {
        e.preventDefault();

        var form = $(e.target);

        this.model.set('oldPassword', form.find('[name="oldPassword"]').val());
        this.model.set('newPassword', form.find('[name="newPassword"]').val());
        this.model.set('newPasswordConfirmation', form.find('[name="newPasswordConfirmation"]').val());

        var self = this;
        self.model.save(null, {
            success: function () {
                $(e.target)[0].reset();
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function () {
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});


app.View.TabSearch = Backbone.View.extend({
    templateSearch: _.template($('#search-filter').html()),
    initialize: function () {
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new app.View.Tab({
            collection: this.collection,
            ViewModel: this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    events: {
        'keyup :input#block_filter': 'search'
    },

    search: function (e) {
        var input = e.target.value;
        if (input != '') {
            this.collection.reset();
            this.collection.search(input);
        }
    },

    selectMenu: function (menu) {
        this.$el.find('ul.nav.nav-tabs a').parent().removeClass('active');
        this.$el.find('ul.nav.nav-tabs a[href="#/' + menu + '"]').parent().addClass('active');
    },

    render: function () {
        this.$el.empty();
        this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.templateSearch());
        this.$el.append(this.views.tab.render());
        this.delegateEvents();
        return this.$el;
    }
});


app.View.TabContainer = Backbone.View.extend({
    initialize: function () {
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new app.View.Tab({
            collection: this.collection,
            ViewModel: this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    selectMenu: function (menu) {
        this.$el.find('ul.nav.nav-tabs a').parent().removeClass('active');
        this.$el.find('ul.nav.nav-tabs a[href="#/' + menu + '"]').parent().addClass('active');
    },

    render: function () {
        this.$el.empty();
        this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.views.tab.render());
        this.delegateEvents();
        return this.$el;
    }
});

app.View.Tab = Backbone.View.extend({
    initialize: function () {
        this.$el.addClass('table');
        this.template = this.options.template;
        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.addItem, this);
    },

    tagName: 'table',

    addItem: function (item) {
        this.$el.append(new this.options.ViewModel({
            model: item
        }).render());
    },

    render: function () {
        this.$el.empty();
        this.$el.append(this.template());
        this.collection.forEach(this.addItem, this);
        this.delegateEvents();
        return this.$el;
    }
});

app.Collection.TabUser = Backbone.Collection.extend({
    initialize: function () {
        this.options = {};
        this.options.url = {
            owned: '/tatami/rest/users',
            recommended: '/tatami/rest/users/suggestions',
            search: '/tatami/rest/search/users'
        };
    },

    recommended: function () {
        this.url = this.options.url.recommended;
        this.parse = function (users) {
            return users.map(function (user) {
                user.followed = false;
                user.avatar = (_.isEmpty(user.avatar)) ? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch();
    },
    owned: function () {
        this.url = this.options.url.owned + "/" + username + "/friends";
        this.parse = function (users) {
            return users.map(function (user) {
                user.followed = true;
                user.avatar = (_.isEmpty(user.avatar)) ? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch();
    },

    search: function (query) {
        this.url = this.options.url.search;
        this.parse = function (users) {
            return users.map(function (user) {
                user.avatar = (_.isEmpty(user.avatar)) ? '/img/default_image_profile.png' : '/tatami/avatar/' + user.avatar + '/photo.jpg';
                return user;
            });
        };
        this.fetch({
            data: {
                q: query
            }
        });

    }
});

app.View.User = Backbone.View.extend({
    initialize: function () {
        app.views = {};
    },

    template: _.template($('#users-item').html()),
    tagName: 'tr',

    events: {
    },

    renderFollow: function () {
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
        if (typeof followed === 'undefined')
            $.get('/tatami/rest/friendships', {screen_name: user}, onFinish, 'json');
        else onFinish(followed);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.renderFollow();
        this.delegateEvents();
        return this.$el;
    }
});

app.Model.FollowUserModel = Backbone.Model.extend({
    url: function () {
        return '/tatami/rest/friendships/create';
    }
});

app.Model.UnFollowUserModel = Backbone.Model.extend({
    url: function () {
        return '/tatami/rest/friendships/destroy';
    }
});

app.View.FollowButtonView = Backbone.View.extend({
    templateFollow: _.template($('#follow-button').html()),
    templateFollowed: _.template($('#followed-button').html()),
    templateUserEdit: _.template($('#edit-profile').html()),

    initialize: function () {
        this.set(this.options.owner, this.options.followed);
    },

    set: function (owner, followed) {
        if (owner) {
            this.events = {
                "click .btn": "editMyProfile"
            };
            this.editMyProfileRender();
        }
        else if (!owner && followed) {
            this.events = {
                "click .btn": "unfollow"
            };
            this.followedRender();
        }
        else if (!owner && !followed) {
            this.events = {
                "click .btn": "follow"
            };
            this.followRender();
        }
    },

    editMyProfile: function () {
        window.location = '/tatami/account/#/profile';
    },

    follow: function () {
        var self = this;
        this.undelegateEvents();
        $(this.el).empty();

        var m = new app.Model.FollowUserModel();
        m.set('username', this.options.username);

        m.save(null, {
            success: function () {
                self.set(self.options.owner, true);
                self.delegateEvents();
            },
            error: function () {
                self.set(self.options.owner, false);
                self.delegateEvents();
            }
        });
    },

    unfollow: function () {
        var self = this;
        this.undelegateEvents();
        $(this.el).empty();

        var m = new app.Model.UnFollowUserModel();
        m.set('username', this.options.username);

        m.save(null, {
            success: function () {
                self.set(self.options.owner, false);
                self.delegateEvents();
            },
            error: function () {
                self.set(self.options.owner, true);
                self.delegateEvents();
            }
        });
    },

    followRender: function () {
        $(this.el).html(this.templateFollow());
    },

    followedRender: function () {
        $(this.el).html(this.templateFollowed());
    },

    editMyProfileRender: function () {
        $(this.el).html(this.templateUserEdit());
    },

    render: function () {
        return $(this.el);
    }

});

app.Collection.TabTag = Backbone.Collection.extend({
    initialize: function () {
        this.options = {};
        this.options.url = {
            owned: '/tatami/rest/tagmemberships/list',
            recommended: '/tatami/rest/tags/popular',
            search: '/tatami/rest/search/tags'
        };
    },
    recommended: function () {
        this.url = this.options.url.recommended;
        this.parse = function (tags) {
            return tags.filter(function (tag) {
                return !(tag.followed);
            });
        };
        this.reset();
        this.fetch();
    },
    owned: function () {
        this.url = this.options.url.owned;
        this.parse = function (tags) {
            return tags;
        };
        this.reset();
        this.fetch();
    },

    search: function (query) {
        this.url = this.options.url.search;
        this.reset();
        this.fetch({
            data: {
                q: query
            }
        })
    }
});

app.View.Tag = Backbone.View.extend({
    initialize: function () {
        this.model.bind('change', this.render, this);

    },

    template: _.template($('#tags-item').html()),
    tagName: 'tr',

    events: {
        'click': 'show',
        'click .follow': 'follow'
    },

    follow: function () {
        var self = this;
        var m;
        if (this.model.get('followed')) {
            m = new app.Model.UnFollowTagModel(this.model.toJSON());
        }
        else {
            m = new app.Model.FollowTagModel(this.model.toJSON());
        }
        m.save(null, {
            success: function () {
                self.model.set('followed', !self.model.get('followed'));
                self.render();
            }
        });
    },

    show: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});


/*
 Tags
 */
app.Model.FollowTagModel = Backbone.Model.extend({
    url: function () {
        return '/tatami/rest/tagmemberships/create';
    }
});

app.Model.UnFollowTagModel = Backbone.Model.extend({
    url: function () {
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
    model: app.Model.Group,
    url: '/tatami/rest/admin/groups'
});

app.View.AddGroup = Backbone.View.extend({
    tagName: 'form',

    initialize: function () {
        this.$el.addClass('form-horizontal row-fluid');

        this.model = new app.Model.Group();
        this.$el.html(this.template(this.model.toJSON()));
    },

    template: _.template($('#groups-form').html()),

    events: {
        'click .show': 'toggle',
        'submit': 'submit',
        'reset': 'toggle'
    },

    toggle: function () {
        this.$el.find('fieldset').toggle();
    },

    render: function () {
        this.delegateEvents();
        return this.$el;
    },

    submit: function (e) {
        e.preventDefault();

        var form = $(e.target);

        this.model.set('name', form.find('[name="name"]').val());
        this.model.set('description', form.find('[name="description"]').val());
        this.model.set('publicGroup', form.find('[name="publicGroup"]:checked').val() === 'public');

        var self = this;
        self.model.save(null, {
            success: function () {
                $(e.target)[0].reset();
                self.$el.find('.return').append($('#form-success').html());
                self.trigger('success');
            },
            error: function () {
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.Collection.TabGroup = Backbone.Collection.extend({
    model: app.Model.Group,
    initialize: function () {
        this.options = {};
        this.options.url = {
            owned: '/tatami/rest/groups',
            recommended: '/tatami/rest/groupmemberships/suggestions',
            search: '/tatami/rest/search/groups'
        };
    },
    recommended: function () {
        this.url = this.options.url.recommended;
        this.parse = function (data, options) {
            return data.filter(function (model) {
                return model.publicGroup;
            });
        };
        this.fetch();
    },
    owned: function () {
        this.url = this.options.url.owned;
        this.parse = function (data, options) {
            return data;
        };
        this.fetch();
    },
    search: function (query) {
        this.url = this.options.url.search;
        this.fetch({
            data: {
                q: query
            }
        })
    }
});

app.View.Group = Backbone.View.extend({
    initialize: function () {
        this.actionsView = new app.View.ActionsGroup({
            model: this.model
        });
        this.actionsView.render();
    },

    template: _.template($('#groups-item').html()),
    tagName: 'tr',

    events: {
    },

    render: function () {
        var self = this;

        var data = this.model.toJSON();
        this.$el.html(this.template(data));
        this.$el.append(this.actionsView.$el);
        this.delegateEvents();
        return this.$el;
    }
});

app.Model.ListUserGroupModel = Backbone.Model.extend({
    idAttribute: 'username',
    defaults: {
        avatar: '',
        firstName: '',
        lastName: '',
        role: ''
    },
    toJSON: function () {
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar: (this.get('avatar')) ? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg' : '/img/default_image_profile.png'
        });
    }
});

app.Collection.ListUserGroupCollection = Backbone.Collection.extend({
    model: app.Model.ListUserGroupModel,
    url: function () {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});

app.View.ActionsGroup = Backbone.View.extend({
    tagName: 'td',
    template: {
        join: _.template($('#groups-join').html()),
        leave: _.template($('#groups-leave').html()),
        admin: _.template($('#groups-admin').html())
    },

    initialize: function () {
        var self = this;
        this.collection = new app.Collection.ListUserGroupCollection();
        this.collection.options = {
            groupId: this.model.id
        };
        this.collection.on('reset', this.render, this);
        this.collection.fetch({
            success: function () {
                self.render();
            }
        });

        this.actionModel = new app.Model.ListUserGroupModel({
            username: username
        });
        this.actionModel.urlRoot = function () {
            return '/tatami/rest/groups/' + self.model.id + '/members/';
        };
    },

    events: {
    },

    renderAdmin: function () {
        this.$el.html(this.template.admin(this.model.toJSON()));
        this.delegateEvents({
            'click': 'onClickAdmin'
        });
    },

    onClickAdmin: function () {
        /*app.router.navigate('/groups/' + this.model.id, {
         trigger:true
         });*/
    },

    renderMember: function () {
        this.$el.html(this.template.leave(this.model.toJSON()));
        this.delegateEvents({
            'click': 'onClickMember'
        });
    },

    onClickMember: function () {
        this.actionModel.destroy({
            success: _.bind(this.renderNotMember, this)
        });
    },

    renderNotMember: function () {
        if (this.model.get('publicGroup')) {
            this.$el.html(this.template.join(this.model.toJSON()));
            this.delegateEvents({
                'click': 'onClickNotMember'
            });
        }
        else {
            this.$el.empty();
        }
    },

    onClickNotMember: function () {
        this.actionModel.save(null, {
            success: _.bind(this.renderMember, this)
        });
    },

    render: function () {
        var template = null;

        var self = this;
        var isAdmin = app.collections.adminGroups.some(function (group) {
            return (group.id === self.model.id);
        });
        if (isAdmin) {
            this.renderAdmin();
        } else {
            var isMember = this.collection.some(function (member) {
                return (member.id === username);
            });
            var isPublic = false;
            if (this.model.get('publicGroup')) {
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
    attributes: {
        'class': 'form-horizontal row-fluid'
    },

    initialize: function () {
        this.model = new app.Model.Group({
            groupId: this.options.groupId
        });
        this.model.bind('change', this.render, this);
        this.model.fetch();
    },

    template: _.template($('#groups-form').html()),

    events: {
        'submit': 'submit'
    },

    render: function () {
        this.delegateEvents();
        return this.$el.html(this.template(this.model.toJSON()));
    },

    submit: function (e) {
        e.preventDefault();

        var form = $(e.target);

        this.model.set('name', form.find('[name="name"]').val());
        this.model.set('description', form.find('[name="description"]').val());
        this.model.set('archivedGroup', form.find('[name="archivedGroup"]:checked').val() === 'true');

        var self = this;
        self.model.save(null, {
            success: function () {
                self.$el.find('.return').append($('#form-success').html());
            },
            error: function () {
                self.$el.find('.return').append($('#form-error').html());
            }
        });
    }
});

app.View.ListUserGroup = Backbone.View.extend({
    tagName: 'table',
    attributes: {
        'class': 'table'
    },
    initialize: function () {
        this.options = _.defaults(this.options, {
            admin: true
        });

        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.addItem, this);

        this.collection.fetch();
    },

    addItem: function (model) {
        var view = new app.View.ListUserGroupItem(
            _.defaults({
                model: model
            }, this.options)
        );
        view.render();
        this.$el.append(view.el);
    },
    render: function () {
        var tableView = this;

        this.$el.html($('#usergroup-header').html());
        this.collection.forEach(this.addItem, this);

        return this;
    }
});

app.View.ListUserGroupItem = Backbone.View.extend({
    tagName: 'tr',

    template: _.template($('#usergroup-item').html()),

    initialize: function () {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },

    events: {
        'click .delete': 'removeUser'
    },

    removeUser: function () {
        this.model.destroy();
    },

    render: function () {
        var locals = this.model.toJSON();
        locals.admin = this.options.admin;
        this.$el.html(this.template(locals));
        return this;
    }
});

app.Model.ListUserGroupModel = Backbone.Model.extend({
    idAttribute: 'username',
    defaults: {
        avatar: '',
        firstName: '',
        lastName: '',
        role: ''
    },
    toJSON: function () {
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar: (this.get('avatar')) ? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg' : '/img/default_image_profile.png'
        });
    }
});

app.Collection.ListUserGroupCollection = Backbone.Collection.extend({
    model: app.Model.ListUserGroupModel,
    url: function () {
        return '/tatami/rest/groups/' + this.options.groupId + '/members/';
    }
});

app.Model.UserSearch = Backbone.Model.extend({
    toString: function () {
        return this.get('username');
    },
    toLowerCase: function () {
        return this.toString().toLowerCase();
    },
    replace: function (a, b, c) {
        return this.toString().replace(a, b, c);
    }
});

app.Collection.UserSearch = Backbone.Collection.extend({
    url: '/tatami/rest/users/search',

    model: app.Model.UserSearch,

    search: function (q, callback) {
        var self = this;
        this.fetch({
            data: {
                q: q
            },
            success: function (collection) {
                var result = self.removeAlreadyMember();
                callback(result);
            }
        });
    },

    removeAlreadyMember: function () {
        var collectionFilter = this.options.filter;
        if (typeof collectionFilter != 'undefined') {
            return this.filter(function (result) {
                var isAlreadyMember = collectionFilter.find(function (user) {
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
    tagName: 'form',
    attributes: {
        'class': 'form-horizontal row-fluid'
    },
    initialize: function () {
        this.$el.html(this.template());
        var self = this;

        window.collection = this.collection;

        var search = new app.Collection.UserSearch();
        search.options = {
            filter: this.collection
        };
        this.$el.find('[name="username"]').typeahead({
            source: function (query, callback) {
                search.search(query, function (results) {
                    return callback(results);
                });
            },
            highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                var avatar = (item.get('avatar')) ? '/tatami/avatar/' + item.get('avatar') + '/photo.jpg' : '/img/default_image_profile.png'
                return '<img class="avatar img-rounded img-small" src="' + avatar + '" />' + '@' + item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>';
                }) + ' - ' + item.get('firstName') + ' ' + item.get('lastName');
            }
        });
    },

    template: _.template($('#groups-form-adduser').html()),

    events: {
        'submit': 'submit'
    },

    render: function () {
        return this;
    },

    submit: function (e) {
        e.preventDefault();

        var form = $(e.target);

        var data = {
            'username': form.find('[name="username"]').val()
        };

        var self = this;
        self.collection.create(data, {
            success: function (model) {
                self.$el.find('.return').append($('#groups-form-adduser-success').html());
            },
            error: function (model) {
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
    url: '/tatami/rest/stats/day'
});

app.View.DailyStatsView = Backbone.View.extend({
    initialize: function () {
        var self = this;
        this.model = new app.Collection.DailyStatCollection();
        this.model.bind('reset', this.render, this);
        this.model.fetch({
            success: function () {
                self.render();
            }
        });
        $(window).bind("resize.app", _.bind(this.render, this));
    },

    render: function () {
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

app.Model.FileModel = Backbone.Model.extend({
    idAttribute: 'attachmentId',
    initialize: function () {

    }
});

app.Collection.FilesCollection = Backbone.Collection.extend({
    model: app.Model.FileModel,
    url: '/tatami/rest/attachments',

    initialize: function () {

    }
});

app.View.FilesViewItem = Backbone.View.extend({
    template: _.template($('#files-item').html()),

    initialize: function () {
        this.model.bind('change', this.render, this);
    },

    tagName: 'tr',

    events: {
        'click .btn': 'removeImage'
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this.$el;
    },

    removeImage: function () {
        var self = this;
        this.model.destroy({
            success: function () {
                self.remove();
                app.trigger('refreshQuota');
                app.trigger('deleteSucess');
            },
            error: function () {
                app.trigger('deleteError');
            }
        });
    }

});


app.Model.QuotaModel = Backbone.Model.extend({
    url: '/tatami/rest/attachments/quota'
});


app.View.QuotaFiles = Backbone.View.extend({
    template: _.template($('#files-quota').html()),

    initialize: function () {
        this.model = new app.Model.QuotaModel();
        this.model.bind('change', this.render, this);
        this.model.fetch();

        var self = this;

        app.on('refreshQuota', function () {
            self.model.fetch();
        });
    },

    render: function () {
        var quota = this.model.get(0);
        quota = Math.round(quota);
        this.$el.html(this.template({quota: quota}));
        return this.$el;
    }

});


app.View.FilesView = Backbone.View.extend({
    MenuTemplate: _.template($('#files-menu').html()),
    HeaderTemplate: _.template($('#files-header').html()),

    initialize: function () {
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.files = new app.View.Tab({
            collection: this.collection,
            ViewModel: app.View.FilesViewItem,
            template: this.HeaderTemplate
        });

        this.views.quota = new app.View.QuotaFiles();

        app.on('deleteSucess', function () {
            $('.file-infos').append($('#delete-file-success').html());
        });

        app.on('deleteError', function () {
            $('.file-infos').append($('#delete-file-error').html());
        });
    },

    render: function () {
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

app.Router.AdminRouter = Backbone.Router.extend({

    initialize: function () {
        this.views = [];
    },

    selectMenu: function (menu) {
        $('.adminMenu a').parent().removeClass('active');
        $('.adminMenu a[href="/tatami/account/#/' + menu + '"]').parent().addClass('active');
    },

    resetView: function () {
        this.views = [];
        $('#accountContent').empty();
    },

    addView: function (view) {
        this.views.push(view);
        $('#accountContent').append(view.$el);
        view.render();
    },

    routes: {
        'profile': 'profile',
        'preferences': 'preferences',
        'password': 'password',
        'groups': 'groups',
        'groups/recommended': 'recommendedGroups',
        'groups/search': 'searchGroup',
        'groups/:id': 'editGroup',
        'tags': 'tags',
        'tags/recommended': 'recommendedTags',
        'tags/search': 'searchTags',
        'users': 'users',
        'users/recommended': 'recommendedUsers',
        'users/search': 'searchUsers',
        'status_of_the_day': 'status_of_the_day',
        'files': 'files',
        '*action': 'profile'
    },

    profile: function () {
        this.selectMenu('profile');

        if (!app.views.profile) {
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

    preferences: function () {
        this.selectMenu('preferences');

        if (!app.views.preferences) {
            app.views.preferences = new app.View.Preferences();
        }

        this.resetView();
        this.addView(app.views.preferences);
    },

    password: function () {
        this.selectMenu('password');

        if (!app.views.password) {
            app.views.password = new app.View.Password();
        }

        this.resetView();
        this.addView(app.views.password);
    },

    initGroups: function () {
        if (!app.views.groups)
            app.views.groups = new app.View.TabContainer({
                collection: new app.Collection.TabGroup(),
                ViewModel: app.View.Group,
                MenuTemplate: _.template($('#groups-menu').html()),
                TabHeaderTemplate: _.template($('#groups-header').html())
            });
        if (!app.collections.adminGroups) app.collections.adminGroups = new app.Collection.AdminGroup();
        app.collections.adminGroups.fetch({
            success: function () {
                app.views.groups.render();
            }
        });
        return app.views.groups;
    },

    initAddGroup: function (listView) {
        if (!app.views.addgroup) {
            app.views.addgroup = new app.View.AddGroup();
            app.views.addgroup.bind('success', listView.collection.fetch, listView.collection);
            app.views.addgroup.bind('success', app.collections.adminGroups.fetch, app.collections.adminGroups);
        }
        return app.views.addgroup;
    },

    groups: function () {
        var view = this.initGroups();
        this.selectMenu('groups');

        view.collection.owned();

        var addview = this.initAddGroup(view);

        addview.collection = view.collection;

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(addview);
            this.addView(view);
        }
        view.selectMenu('groups');
    },

    recommendedGroups: function () {
        var view = this.initGroups();
        this.selectMenu('groups');

        view.collection.recommended();

        var addview = this.initAddGroup(view);

        addview.collection = view.collection;

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(addview);
            this.addView(view);
        }
        view.selectMenu('groups/recommended');
    },

    initSearchGroups: function () {
        if (!app.views.SearchGroups)
            app.views.SearchGroups = new app.View.TabSearch({
                collection: new app.Collection.TabGroup(),
                ViewModel: app.View.Group,
                MenuTemplate: _.template($('#groups-menu').html()),
                TabHeaderTemplate: _.template($('#groups-header').html())
            });
        return app.views.SearchGroups;
    },

    searchGroup: function () {
        var view = this.initSearchGroups();
        this.selectMenu('groups');
        view.selectMenu('groups/search');

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('groups/search');
    },

    editGroup: function (id) {
        this.selectMenu('');

        this.resetView();
        this.addView(new app.View.EditGroup({
            groupId: id
        }));
        var collection = new app.Collection.ListUserGroupCollection();
        collection.options = {
            groupId: id
        };

        this.addView(new app.View.AddUserGroup({
            collection: collection
        }));

        this.addView(new app.View.ListUserGroup({
            collection: collection,
            groupId: id
        }));
    },

    initTags: function () {
        if (!app.views.tags)
            app.views.tags = new app.View.TabContainer({
                collection: new app.Collection.TabTag(),
                ViewModel: app.View.Tag,
                MenuTemplate: _.template($('#tags-menu').html()),
                TabHeaderTemplate: _.template($('#tags-header').html())
            });
        return app.views.tags;
    },

    tags: function () {
        var view = this.initTags();
        this.selectMenu('tags');

        view.collection.owned();
        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('tags');
    },

    recommendedTags: function () {
        var view = this.initTags();
        this.selectMenu('tags');

        view.collection.recommended();

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('tags/recommended');
    },

    initSearchTags: function () {
        if (!app.views.SearchTags)
            app.views.SearchTags = new app.View.TabSearch({
                collection: new app.Collection.TabTag(),
                ViewModel: app.View.Tag,
                MenuTemplate: _.template($('#tags-menu').html()),
                TabHeaderTemplate: _.template($('#tags-header').html())
            });
        return app.views.SearchTags;
    },

    searchTags: function () {
        var view = this.initSearchTags();
        this.selectMenu('tags');

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('tags/search');
    },

    initUsers: function () {
        if (!app.views.users)
            app.views.users = new app.View.TabContainer({
                collection: new app.Collection.TabUser(),
                ViewModel: app.View.User,
                MenuTemplate: _.template($('#users-menu').html()),
                TabHeaderTemplate: _.template($('#users-header').html())
            });
        return app.views.users;
    },

    users: function () {
        var view = this.initUsers();
        this.selectMenu('users');

        view.collection.owned();

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('users');
    },

    recommendedUsers: function () {
        var view = this.initUsers();
        this.selectMenu('users');

        view.collection.recommended();

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('users/recommended');
    },

    initSearchUser: function () {
        if (!app.views.SearchUsers)
            app.views.SearchUsers = new app.View.TabSearch({
                collection: new app.Collection.TabUser(),
                ViewModel: app.View.User,
                MenuTemplate: _.template($('#users-menu').html()),
                TabHeaderTemplate: _.template($('#users-header').html())
            });
        return app.views.SearchUsers;
    },

    searchUsers: function () {
        var view = this.initSearchUser();
        this.selectMenu('users');

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        view.selectMenu('users/search');
    },

    status_of_the_day: function () {
        this.selectMenu('status_of_the_day');
        if (!app.views.daily)
            app.views.daily = new app.View.DailyStatsView();
        var view = app.views.daily;

        this.resetView();
        this.addView(view);
    },

    initFiles: function () {
        if (!app.views.files)
            app.views.files = new app.View.FilesView({
                collection: new app.Collection.FilesCollection()
            });

        return app.views.files;
    },

    files: function () {
        this.selectMenu('files');
        var view = this.initFiles();

        view.collection.fetch();

        if (this.views.indexOf(view) === -1) {
            this.resetView();
            this.addView(view);
        }
        this.selectMenu('files');

    }

});

$(function () {

    app.router = new app.Router.AdminRouter();
    Backbone.history.start();

});
