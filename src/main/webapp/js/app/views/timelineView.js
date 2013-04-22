(function(Backbone, _, Tatami){
    var TimelineView = Backbone.Marionette.ItemView.extend({
        template: "#TimelineView",
        modelEvents: {
            "change": "render",
            "sync": "render"
        }
    });

    Tatami.Views.TimelineView = TimelineView;
})(Backbone, _, Tatami);
