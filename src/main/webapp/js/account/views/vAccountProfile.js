
var VAccountProfile = Marionette.ItemView.extend({
    initialize : function(){
         this.model.fetch();
    },
    tagName: 'form',
    template: '#accountProfile',

    events: {
        'submit': 'saveForm'
    },

    modelEvents: {
        'sync': 'render'
    },

    onRender: function(){
        this.initFileUpload();
        this.initFileUploadBind();
    },

    initFileUpload: function(){
        var self = this;
        this.$dropzone = self.$el.find('.dropzone');
        this.$el.find('#avatarFile').fileupload({
            dataType: 'json',
            sequentialUploads: 'true',

            dropZone: this.$dropzone

        });
    },
    initFileUploadBind: _.once(function(){
        var self = this;

        $(document).bind('dragover', function (e) {

            var dropZone = self.$dropzone,
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
            }, jQuery.fx.speeds._default);
        });
        $(document).bind('drop dragover', function (e) {
            return false;
        });
        self.$el.find('.dropzone').bind('click', function(){
            self.$el.find('#avatarFile').click();
        });
    }),

    saveForm: function(e){
        e.preventDefault();
        var self = this;

        _.each($(e.target).serializeArray(), function(value){
            self.model.set(value.name, value.value);
        });

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

var VAccountProfileDestroy = Marionette.ItemView.extend({
    tagName: 'form',
    template: '#accountDestroy',

    events: {
        'submit': 'destroy'
    },

    destroy: function(e){
        e.preventDefault();
        var self = this;

        self.model.destroy({
            success: function(){
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});


