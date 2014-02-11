/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 31/07/13
 * Time: 18:44
 * To change this template use File | Settings | File Templates.
 */

(function(Backbone, _, Tatami){

    var VFile = Marionette.ItemView.extend({
        template: '#FileItemTemplate',
        tagName: 'tr',

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
                    app.trigger('even-alert-error', app.deleteFileError);
                }
            });
        }
    });

    var VQuotaFiles = Marionette.ItemView.extend({

        template: '#files-quota',

        initialize: function(){

            this.model.fetch();

            app.on('refreshQuota', _.bind(this.model.fetch, this.model));
        },

        modelEvents: {
            "sync" : "render"
        },

        round: function(){
            var quota = this.model.get(0);
            quota = Math.round(quota);
        }
    });

    var VFilesList  = Backbone.Marionette.CompositeView.extend({
        itemView: VFile,
        itemViewContainer: '.items',
        template :'#FilesListTemplate',

        initialize: function(){
            var self = this;
            this.listenTo(Tatami.app, 'next', function(){
                self.collection.next();
            });
        }
    });

    var VFilesMenu = Marionette.ItemView.extend({
        template: '#files-menu'
    });

    Tatami.Views.QuotaFiles = VQuotaFiles;
    Tatami.Views.FilesList = VFilesList;
    Tatami.Views.FilesMenu = VFilesMenu;

})(Backbone, _, Tatami);
