(function(Backbone, _, Tatami){
    var StatusUpdateButton = Backbone.Marionette.ItemView.extend({
        initialize: function(){
            _.defaults(this.options, {
                count: 0
            });
            this.$el.css('display', 'none');
            this.listenTo(Tatami.app, 'statusPending', function(hiddenStatuses){
                this.options.count = hiddenStatuses.length;
                this.render();
            });
        },
        serializeData: function(){
            return this.options;
        },
        events: {
            'click': 'onClick'
        },
        onClick: function(){
            Tatami.app.trigger('dislay');
            this.$el.slideUp();
        },
        onRender: function(){
            if(this.options.count !== 0) this.$el.slideDown();
        },
        className: 'text-center',
        template: '#StatusUpdateButton'
    });

    var StatusTimelineRegion = Backbone.Marionette.Layout.extend({
        template: '#StatusTimelineRegion',
        regions: {
            timeline: '.timeline',
            refresh: '.refresh-button'
        }
    });

    Tatami.Views.StatusTimelineRegion = StatusTimelineRegion;
    Tatami.Views.StatusUpdateButton = StatusUpdateButton;
})(Backbone, _, Tatami);