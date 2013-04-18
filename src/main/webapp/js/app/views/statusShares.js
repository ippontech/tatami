(function(Backbone, _, Tatami){
    StatusShareItems = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: '#StatusShareItems'
    });

    StatusShares = Backbone.Marionette.CompositeView.extend({
        itemView: StatusShareItems,
        template: "#StatusShares"
    });

    Tatami.Views.StatusShareItems = StatusShareItems;
    Tatami.Views.StatusShares = StatusShares;
})(Backbone, _, Tatami);