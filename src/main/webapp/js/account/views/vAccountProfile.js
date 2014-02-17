
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
        'change:avatar': 'render',
        'change' :'render',
        'sync' : 'render'
    },

    onRender: function(){
      if (!ie || ie>9){
        this.initFileUpload();
        this.initFileUploadBind();
      } else {
        this.initFileUploadIE();
        $(":file").filestyle({
            input: false,
            buttonText: "Photo",
            classButton: "btn btn-primary",
            icon: false
        });
      } 
    },

    initFileUpload: function(){
        var self = this;
        this.$dropzone = self.$el.find('.dropzone');
        this.$el.find('#avatarFile').fileupload({
            dataType: 'json',
            sequentialUploads: 'true',
            progressall: function (e, data) {
                self.$el.find('.attachmentBar').show();
                var progress = parseInt(data.loaded / data.total * 100, 10);
                self.$el.find('.attachmentBar .bar').css(
                    'width',
                    progress + '%'
                );
            },
            dropZone: this.$dropzone,
            done: function (e, data) {
                self.$el.find('.attachmentBar').hide();
                self.$el.find('.attachmentBar .bar').css(
                    'width','0%'
                );
                $.each(data.result, function (index, attachment) {
                    var size = "";
                    if (attachment.size < 1000000) {
                        size = (attachment.size / 1000).toFixed(0) + "K";
                    } else {
                        size = (attachment.size / 1000000).toFixed(2) + "M";
                    }
                    $("<p>" + attachment.name + " (" + size + ")" + "<input type='hidden' name='attachmentIds[]' value='" + attachment.attachmentId + "'/></p>").appendTo(self.$el.find(".fileUploadResults"));
                });
                app.trigger('even-alert-success',app.formSuccess);
                self.$el.find('.avatar').attr('src', data.result[0].url);
            },
            fail: function (e, data) {
                self.$el.find('.attachmentBar').hide();
                self.$el.find('.attachmentBar .bar').css(
                    'width','0%'
                );
                if (data.errorThrown == "Forbidden") {
                    self.$el.find("<p>Attachment failed! You do not have enough free disk space.</p>").appendTo($("#fileUploadResults"));
                }
                app.trigger('even-alert-error', app.formError);
            }
        });
    },

    initFileUploadIE: function(){
        var self = this;
        this.$el.find('#avatarFile').fileupload({
            dataType: 'text',
            sequentialUploads: 'true',
            dropZone: this.$dropzone,
            done: function (e, data) {
                self.$el.find('.glyphicon').attr('class', 'glyphicon glyphicon-ok');
                self.$el.find('.upload-ok').css('display','inline');
            },
            fail: function (e, data) {
                self.$el.find('.glyphicon').attr('class', 'glyphicon glyphicon-remove');
                self.$el.find('.upload-ko').css('display','inline');
            }
        });

    },

    initFileUploadBind: _.once(function(){
        var self = this;
            self.render();
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

