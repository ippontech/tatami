
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



        console.log($('[name="result_filter"]'));
        console.log(this.options.inputURL);
   },


    serializeData : function(){
       /* var self = this;
        Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
            // load your template here, returning the data needed for the compileTemplate
            // function. For example, you have a function that creates templates based on the
            // value of templateId
            self.$el.html(Backbone.Marionette.TemplateCache.get("#groups-form-adduser"));
            var newTemp = $('#search-filter',this.$el).val(self.options.inputURL) ;

            // send the template back
            return newTemp;
        }  */
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

        this.trigger('search', input);
        //ARTHUR GREG WHY?
        Backbone.history.navigate(this.options.urlHistory + input, {trigger: false});
    }

});

var VTab = Marionette.ItemView.extend({
   /* initialize: function() {
        this.$el.addClass('table');
        this.template = this.options.template;
        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', this.addItem, this);
    },

    tagName: 'table',

    addItem: function(item) {
        this.$el.append(new this.options.ViewModel({
            model: item
        }).render());
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
        this.collection.forEach(this.addItem, this);
        this.delegateEvents();
        return this.$el;
    }  */
});