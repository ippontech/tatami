(function(Backbone, _, Tatami){
    StatusEdit = Backbone.Marionette.Layout.extend({
        onRender: function(){
            _.defaults(this.options, {
                maxLenght: 750
            });

            this.reset();
        },

        regions: {
            tatamReply: ".tatam-reply"
        },

        events: {
            'hidden': 'reset',
            'keyup .edit-tatam textarea': 'updatecount'
        },

        updatecount: function(e){
            var $textarea = $(e.currentTarget);
            var $label = this.$el.find('.countstatus');

            var value = this.options.maxLenght - $textarea.val().length;
        },

        show: function(options){
            if(options.status) {
                var self = this;
                var status = new Tatami.Models.Statuses({
                    statusId: options.status
                });
                status.fetch({
                    success: function(model){
                        var $reply = self.$el.find('.reply');
                        $reply.slideDown();
                        var tatam = new Tatami.Views.StatusItems({
                            model: model
                        });
                        self.tatamReply.show(tatam);
                        tatam.$el.slideDown();
                    }
                });
            }

            this.$el.modal('show');
        },

        hide: function(){
            this.$el.modal('hide');
        },

        reset: function(){
            this.el.reset();

            var $reply = this.$el.find('.reply');
            $reply.css('display', 'none');
        },

        template: '#StatusEdit'
    });

    Tatami.Views.StatusEdit = StatusEdit;
})(Backbone, _, Tatami);