
var VFile = Marionette.ItemView.extend({
    template: '#files-item',
    tagName: 'tr',
    initialize: function(){
        this.$el.addClass('fileItem');
    },

    events:{
        'click .btn':'removeImage'
    },

    removeImage: function(){
        var self = this;
        this.model.destroy({
            success: function(){
                self.remove();
                app.trigger('even-alert-success', app.deleteFileSuccess);
                app.trigger('refreshQuota');
            },
            error: function(){
                app.trigger('even-alert-success', app.deleteFileError);
            }
        });
    }
});

var VQuotaFiles = Marionette.ItemView.extend({

    template: '#files-quota',
    //tagName : 'span',

    initialize: function(){

        this.model.fetch();

        app.on('refreshQuota', _.bind(this.model.fetch, this.model));
    },

    modelEvents: {
        //"change" : "render"  ,
       // "change" : "round render"
        "sync" : "render"
    },

    onRender: function(){

    },

    round: function(){
        var quota = this.model.get(0);
        quota = Math.round(quota);
    }
});

var VFiles =  Marionette.CollectionView.extend({

       itemView : VFile,

        initialize: function() {
            _.bindAll(this);

            this.$el.addClass('row-fluid');
        }
})  ;

var VFilesMenu = Marionette.ItemView.extend({
    template: '#files-menu'

});

var VFilesHeader = Marionette.ItemView.extend({
    template: '#files-header',
    tag :'div',
    initialize: function() {


        this.$el.addClass('littleMargeBot');
    }

});
