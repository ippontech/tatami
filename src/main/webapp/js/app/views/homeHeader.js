(function(Backbone, _, Tatami){
    var HomeHeader = Backbone.Marionette.ItemView.extend({
        template: '#HomeHeader',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.HomeHeader = HomeHeader;
})(Backbone, _, Tatami);