
var VTabMenu = Marionette.ItemView.extend({

        //Le template de la navigation change, le template est donc défini dans le router directement

        initialize: function(myTemplate){
            this.$el.addClass('tabMenu');

        },

        selectMenu: function(menu) {
            $('ul.nav.nav-tabs a').parent().removeClass('active');
            $('ul.nav.nav-tabs a[href="#' + menu + '"]').parent().addClass('active');
        }
} );


var VTabSearch = Marionette.ItemView.extend({

    template : '#search-filter',
    tagName : 'form',

    initialize: function(options){
        this.$el.addClass('row-fluid littleMargeBot');
   },

    events:{
        'submit':'submit',
        'keyup':'change',
        'initialize:after' : 'refreshField'
    },

    refreshField : function(){
        $('[name="result_filter"]').val(this.options.inputURL) ;
    },

    change: function(e){
        var input = e.target.value;
        this.search(input);
    },

    submit: function(e){
        e.preventDefault();
        var input = $(e.target).find('[name="result_filter"]').val();
        this.search(input);
    },

    search: function(input){

        if(input) this.trigger('search', input);
        Backbone.history.navigate(this.options.urlHistory + input, {trigger: false});
    }

});