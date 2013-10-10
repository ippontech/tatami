(function(Backbone, _, Tatami){
    var StatusUpdateButton = Backbone.Marionette.ItemView.extend({
        initialize: function(){
            _.defaults(this.options, {
                count: 0
            });
            this.$el.css('display', 'none');
            this.listenTo(Tatami.app, 'statusPending', function(hiddenStatuses){
                this.options.count = (hiddenStatuses)? hiddenStatuses.length: 0;
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
            $(this.el).removeClass('refresh-button-style');
            Tatami.app.trigger('display');
            document.title = "Tatami";
            this.$el.slideUp();
        },
        onRender: function(){
            if(this.options.count !== 0) {
                $(this.el).addClass('refresh-button-style');
                document.title = "Tatami (" + this.options.count + ")";
                this.$el.slideDown();
                Tatami.app.favi.badge(this.options.count) ;
            } else {
                $(this.el).removeClass('refresh-button-style');
                document.title = "Tatami";
                this.$el.slideUp();

            }
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
