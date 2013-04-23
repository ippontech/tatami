(function(Backbone, _, Tatami){
    var TagTrendItems = Backbone.Marionette.ItemView.extend({
        template: '#TagTrendItems'
    });

    var TagTrends = Backbone.Marionette.CompositeView.extend({
        itemView: TagTrendItems,
        itemViewContainer: '.items',
        template: '#TagTrends'
    });

    Tatami.Views.TagTrends = TagTrends;
})(Backbone, _, Tatami);