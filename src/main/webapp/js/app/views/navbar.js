(function(Backbone, _, Tatami){
    var Navbar = Backbone.Marionette.Layout.extend({
        events: {
            'click .editTatam': 'editTatam'
        },

        editTatam: function(){
            Tatami.app.edit.show();
        }
    });

    Tatami.Views.Navbar = Navbar;
})(Backbone, _, Tatami);