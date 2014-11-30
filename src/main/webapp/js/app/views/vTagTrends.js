(function(Backbone, _, Tatami){
    var TagTrendItems = Backbone.Marionette.ItemView.extend({
        template: '#TagTrendItems',
        events: {
            'click .toggleTag': 'toggleTag'
        },
        modelEvents: {
            'change': 'render'
        },
        toggleTag: function(){
            this.model.save({
              followed: !this.model.get('followed')
            }, {
              success: _.bind(this.render, this)
            });
        }
    });

    var TagTrends = Backbone.Marionette.CompositeView.extend({
        itemView: TagTrendItems,
        itemViewContainer: '.items',
        template: '#TagTrends'
    });

    var TagTrendsProfile = Backbone.Marionette.CompositeView.extend({
        itemView: TagTrendItems,
        itemViewContainer: '.items',
        template: '#TagTrendsProfile'
    });

    Tatami.Views.TagTrends = TagTrends;
    Tatami.Views.TagTrendsProfile = TagTrendsProfile;
})(Backbone, _, Tatami);