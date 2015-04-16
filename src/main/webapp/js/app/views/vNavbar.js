(function(Backbone, _, Tatami){
    var Navbar = Backbone.Marionette.Layout.extend({
        initialize: function(){
            this.$el.find('[name="search"]').typeahead(new Tatami.Search());
            $(".deleteicon").hide();
            var navbar = this;
            $("#searchinput").keyup(function(event) {
                navbar.displayHideDeleteIcon();
            });             
        },

        events: {
            'click .editTatam': 'editTatam',
            'submit #searchform' : 'search',
            'click .deleteicon' : 'clear'
        },

        displayHideDeleteIcon: function(){
            var input = $('[name="search"]').val();
            if(input.length > 0){
                $(".deleteicon").show();
            } else {
                $(".deleteicon").hide();
            }
        },

        displaySearch: function(input){
            $('[name="search"]').val(input);
            this.displayHideDeleteIcon();           
        },

        editTatam: function(){
            Tatami.app.trigger('edit:show');
        }, 

        search: function(event){
            event.preventDefault();
            var input = $('[name="search"]').val();
            if(input.indexOf("#") == 0){
                Backbone.history.navigate('tags/' + input.substring(1, input.length), true);
            } else if(input.indexOf("@") == 0){
                Backbone.history.navigate('users/' + input.substring(1, input.length), true);
            } else {
                Backbone.history.navigate('search/' + input, true);
            }
        },

        clear: function(event){
            Backbone.history.navigate('', true);
        }

    });

    Tatami.Views.Navbar = Navbar;
})(Backbone, _, Tatami);