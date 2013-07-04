
var VFile = Marionette.ItemView.extend({
    template: '#files-item',
    tagName: 'tr',
    initialize: function(){
    },

    events:{
        'click .btn':'removeImage'
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
        //this.model.bind('change', this.render, this);
        this.model.fetch();

        var self = this;

        app.on('refreshQuota', function() {
            self.model.fetch();
        });
    },

    modelEvents: {
        "change" : "render"
    } ,

    render: function(){
        var quota = this.model.get(0);
        quota = Math.round(quota);
        this.$el.html(this.template({quota: quota}));
        return this.$el;
    }
});

var VFiles =  Marionette.CollectionView.extend({

       itemView : VFile,

        initialize: function() {
            _.bindAll(this);

            this.$el.addClass('row-fluid');

            app.on('deleteSucess',function(){
                $('.file-infos').append($('#delete-file-success').html());
            });

            app.on('deleteError',function(){
                $('.file-infos').append($('#delete-file-error').html());
            }) ;
        },

        onAfterItemAdded: function(itemView){
            console.log("item was added");
        },
        onRender: function(){
            console.log("render");
        }
})  ;

var VFilesMenu = Marionette.ItemView.extend({
    template: '#files-menu'

});

var VFilesHeader = Marionette.ItemView.extend({
    template: '#files-header'

});
