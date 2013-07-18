/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 28/06/13
 * Time: 14:15
 * To change this template use File | Settings | File Templates.
 */

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
    templateSearch: _.template($('#search-filter').html()),
    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new VTab({
            collection : this.collection,
            ViewModel : this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    events:{
        'keyup :input#block_filter':'search'
    },

    search: function(e){
        var input = e.target.value;
        if(input != '') {
            this.collection.reset();
            this.collection.search(input);
        }
    },

    render: function(){
        this.$el.empty();
        //this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.templateSearch());
        this.$el.append(this.views.tab.render());
        this.delegateEvents();
        return this.$el;
    }
});

var VTabContainer = Marionette.ItemView.extend({
    initialize: function(){
        this.$el.addClass('row-fluid');

        this.views = {};
        this.views.tab = new VTab({
            collection : this.collection,
            ViewModel : this.options.ViewModel,
            template: this.options.TabHeaderTemplate
        });
    },

    selectMenu: function(menu) {
        this.$el.find('ul.nav.nav-tabs a').parent().removeClass('active');
        this.$el.find('ul.nav.nav-tabs a[href="#' + menu + '"]').parent().addClass('active');
    },

    render: function(){
        this.$el.empty();
       // this.$el.append(this.options.MenuTemplate());
        this.$el.append(this.views.tab.render());
        this.delegateEvents();
        return this.$el;
    }
});

var VTab = Marionette.ItemView.extend({
    initialize: function() {
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
    }
});