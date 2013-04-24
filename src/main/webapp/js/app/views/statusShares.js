(function(Backbone, _, Tatami){
    var StatusShareItems = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: '#StatusShareItems'
    });

    var StatusShares = Backbone.Marionette.CompositeView.extend({
        itemView: StatusShareItems,
        template: "#StatusShares"
    });

    Tatami.Views.StatusShareItems = StatusShareItems;
    Tatami.Views.StatusShares = StatusShares;
})(Backbone, _, Tatami);