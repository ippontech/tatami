(function(Backbone, _, Tatami){
    var CardProfile = Backbone.Marionette.ItemView.extend({
        template: '#CardProfile',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.CardProfile = CardProfile;
})(Backbone, _, Tatami);