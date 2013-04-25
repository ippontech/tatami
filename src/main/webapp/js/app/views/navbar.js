(function(Backbone, _, Tatami){
    var Navbar = Backbone.Marionette.Layout.extend({
        initialize: function(){
          this.$el.find('[name="search"]').typeahead(new Tatami.Search());
        },

        events: {
            'click .editTatam': 'editTatam'
        },

        editTatam: function(){
            Tatami.app.trigger('edit:show');
        }
    });

    Tatami.Views.Navbar = Navbar;
})(Backbone, _, Tatami);