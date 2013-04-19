(function(Backbone, _, Tatami){
    TagTrendItems = Backbone.Marionette.ItemView.extend({
        template: '#TagTrendItems'
    });

    TagTrends = Backbone.Marionette.CompositeView.extend({
        itemView: TagTrendItems,
        itemViewContainer: '.items',
        template: '#TagTrends'
    });

    Tatami.Views.TagTrends = TagTrends;
})(Backbone, _, Tatami);