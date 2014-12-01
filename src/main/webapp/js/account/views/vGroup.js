
var VAddGroup = Marionette.ItemView.extend({

    template:'#groups-form',
    tagName: 'form',

    events:{
        'click .show': 'toggle',
        'submit': 'submit',
        'reset': 'toggle'
    },

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');
    },

    toggle: function(){
        this.$el.find('fieldset').toggle();
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
                app.trigger('even-alert-success', app.formSuccess);
                self.trigger('success');
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});



var VEditGroup = Marionette.ItemView.extend({

    tagName: 'form',

    template: '#groups-form',

    events:{
        'submit': 'submit' ,
        'sync' : 'render'
    },

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

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('name', form.find('[name="name"]').val());
        this.model.set('description', form.find('[name="description"]').val());
        this.model.set('archivedGroup', form.find('[name="archivedGroup"]:checked').val() === 'true');

        var self = this;
        self.model.save(null, {
            success: function(){
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});

var VAddUserGroup = Marionette.ItemView.extend({

    template: '#groups-form-adduser',

    events:{
        'submit': 'submit'
    },

    tagName : 'form',
    attributes : {
        'class' : 'form-horizontal row-fluid'
    },
    initialize: function(){

        this.$el.html(Backbone.Marionette.TemplateCache.get("#groups-form-adduser"));

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
                app.trigger('even-alert-success', app.memberAddSuccess);
            },
            error: function(model){
                app.trigger('even-alert-error', app.memberAddError);
                model.destroy();
            }
        });
    }
});
