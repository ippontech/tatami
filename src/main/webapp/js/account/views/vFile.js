
var VFilesItem = Marionette.ItemView.extend({
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

var VQuotaFiles = Marionette.ItemView.extend({
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

var VFiles = Marionette.ItemView.extend({
    MenuTemplate: _.template($('#files-menu').html()),
    HeaderTemplate: _.template($('#files-header').html()),

    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.files = new VTab({
            collection : this.collection,
            ViewModel : VFilesItem,
            template: this.HeaderTemplate
        });

        this.views.quota = new VQuotaFiles();

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