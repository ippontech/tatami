(function(Backbone, _, Tatami){
    var StatusEdit = Backbone.Marionette.Layout.extend({
        initialize: function(){
            this.model = new Tatami.Models.PostStatus();
        },
        onRender: function(){
            _.defaults(this.options, {
                maxLenght: 750
            });

            this.$editContent = this.$el.find('.edit-tatam');
            this.$edit = this.$editContent.find('textarea[name="content"]');
            this.$previewContent = this.$el.find('.preview-tatam');
            this.$preview = this.$previewContent.find('.well.markdown');

            this.$reply = this.$el.find('.reply');
            this.$reply.css('display', 'none');

            this.$el.modal('show');
        },

        serializeData: function(){
            return _.extend(Backbone.Marionette.Layout.prototype.serializeData.apply(this, arguments), {
                groups: Tatami.app.groups.toJSON()
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

            var value = this.options.maxLenght - $textarea.val().length;
        },

        togglePreview: function(){
            try{
                this.$preview.html(marked(this.$edit.val()));
            }
            catch(e){
                console.log(e);
            }
            this.$editContent.toggleClass('hide');
            this.$previewContent.toggleClass('hide');
        },

        show: function(options){
            options = (options)? options: {};
            if(options.status) {
                var self = this;
                var status = new Tatami.Models.Statuses({
                    statusId: options.status
                });
                status.fetch({
                    success: function(model){
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