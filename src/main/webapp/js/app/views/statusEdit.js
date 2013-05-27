(function(Backbone, _, Tatami){
    var StatusEdit = Backbone.Marionette.Layout.extend({
        initialize: function(){
            this.model = new Tatami.Models.PostStatus();
        },
        onRender: function(){
            _.defaults(this.options, {
                maxLength: 750
            });

            this.$editContent = this.$el.find('.edit-tatam');
            this.$edit = this.$editContent.find('textarea[name="content"]');
            this.$previewContent = this.$el.find('.preview-tatam');
            this.$preview = this.$previewContent.find('.well.markdown');

            this.$reply = this.$el.find('.reply');
            this.$reply.css('display', 'none');

            this.initFileUpload();
            this.initFileUploadBind();

            this.$el.find('.groups').toggleClass('hide', Tatami.app.groups.length === 0 );

            this.$edit.typeahead(new Tatami.Suggester(this.$edit));

            this.$el.modal('show');
        },

        initFileUpload: function(){
            var self = this;
            self.model.resetAttachments();
            this.$dropzone = self.$el.find('.dropzone');
            this.$el.find('.updateStatusFileupload').fileupload({
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
                        self.model.addAttachment(attachment.attachmentId);
                        $("<p>" + attachment.name + " (" + size + ")" + "<input type='hidden' name='attachmentIds[]' value='" + attachment.attachmentId + "'/></p>").appendTo(self.$el.find(".fileUploadResults"));
                    });
                },
                fail: function (e, data) {
                    self.$el.find('.attachmentBar').hide();
                    self.$el.find('.attachmentBar .bar').css(
                        'width','0%'
                    );
                    if (data.errorThrown == "Forbidden") {
                        self.$el.find("<p>Attachment failed! You do not have enough free disk space.</p>").appendTo($("#fileUploadResults"));
                    }
                }
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
                self.$el.find('.updateStatusFileupload').click();
            });
        }),

        serializeData: function(){
            return _.extend(Backbone.Marionette.Layout.prototype.serializeData.apply(this, arguments), {
                groups: (new Tatami.Collections.Groups(Tatami.app.groups.where({archivedGroup: false}))).toJSON()
            });
        },

        regions: {
            tatamReply: ".tatam-reply"
        },

        events: {
            'keyup .edit-tatam textarea': 'updatecount',
            'click .edit-tatam-float-right': 'togglePreview',
            'submit': 'submit'
        },

        updatecount: function(e){
            var $textarea = $(e.currentTarget);
            var $label = this.$el.find('.countstatus');

            var value = this.options.maxLength - $textarea.val().length;
        },

        togglePreview: function(){
            try{
                this.$preview.html(marked(this.$edit.val()));
            }
            catch(e){
                console.log(e);
            }
            this.$el.find('.glyphicon-eye-open, .glyphicon-edit').add(this.$editContent).add(this.$previewContent).toggleClass('hide');
        },

        show: function(options){
            options = (options)? options: {};
            if(options.status) {
                var self = this;
                var statusReply = new Tatami.Models.Status({
                    statusId: options.status
                });
                statusReply.fetch({
                    success: function(model){
                        self.$el.find('.groups').hide();
                        self.$el.find('.status-private').hide();
                        self.$reply.slideDown();
                        var tatam = new Tatami.Views.StatusItems({
                            model: model
                        });
                        self.tatamReply.show(tatam);
                        tatam.$el.slideDown();
                    }
                });
            }

            if (options.status) this.model.set('replyTo', options.status);
            if (options.group) this.model.set('groupId', options.group);

            this.render();
        },

        hide: function(){
            this.$el.modal('hide');
            this.reset();
        },

        reset: function(){
            this.el.reset();

            this.model = new Tatami.Models.PostStatus();

            var $reply = this.$el.find('.reply');
            $reply.css('display', 'none');
        },

        submit: function(e){
            e.preventDefault();
            e.stopPropagation();

            var self = this;

            this.model.set('content', this.$edit.val());
            this.model.set('groupId', this.$el.find('[name="groupId"]').val());
            this.model.set('statusPrivate', this.$el.find('#statusPrivate').prop('checked'));
            this.model.save(null, {
                success: function (model, response) {
                    self.hide();
                    Tatami.app.trigger('refresh', {
                        display: true
                    });
                    Tatami.app.user.set('statusCount', Tatami.app.user.get('statusCount') + 1);
                },
                error: function (model, response) {
                }
            });
        },

        cancel: function(){
            return false;
        },

        template: '#StatusEdit'
    });

    Tatami.Views.StatusEdit = StatusEdit;
})(Backbone, _, Tatami);