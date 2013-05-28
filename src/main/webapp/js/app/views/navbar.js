(function(Backbone, _, Tatami){
    var Navbar = Backbone.Marionette.Layout.extend({
        initialize: function(){
          this.$el.find('[name="search"]').typeahead(new Tatami.Search());
        },

        events: {
            'click .editTatam': 'editTatam',
            'submit #searchform' : 'search'
        },

        editTatam: function(){
            Tatami.app.trigger('edit:show');
        }, 

        search: function(event){
            event.preventDefault();
            var input = $('[name="search"]').val();
            Backbone.history.navigate('search/' + input, true);
        }

    });

    Tatami.Views.Navbar = Navbar;
})(Backbone, _, Tatami);