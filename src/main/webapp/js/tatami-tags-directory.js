_.templateSettings = {
    interpolate:/<\@\=(.+?)\@\>/gim,
    evaluate:/<\@(.+?)\@\>/gim
};

var app;

if (!window.app) {
    app = window.app = _.extend({
        views:{},
        View:{},
        Collection:{},
        Model:{},
        Router:{}
    }, Backbone.Events);
}
else {
    app = window.app;
}

/*
 * Tags directory
 * 
 */

app.Collection.TagCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/tags';
    }
});

app.View.TagsView = Backbone.View.extend({
	template: _.template($('#tags-followed').html()),
    initialize: function() {
        var self = this;
        this.model = new app.Collection.TagCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);

        this.model.fetch();
    },

    render: function() {
        $(this.el).empty();
        if(this.model.length > 0)
            _.each(this.model.models, this.addItem, this);
        else
            $(this.el).html(this.template());
        return $(this.el);
    },

    addItem: function(item, index) {
        var el = new app.View.TagsItemView({
            model: item
        }).render();
        if(index === 0){
        	$(this.el).prepend(el);
        }  
        else{
        	$(this.el).append(el);
        }      
    }
});

app.View.TagsItemView = Backbone.View.extend({
	template: _.template($('#tags-followed').html()),
	
	initialize: function() {
    },

    render: function() {
        $(this.el).html(this.template({tags:this.model.toJSON()}));
        return $(this.el);
    }
});

$(function () {

	var tagView = new app.View.TagsView();
   $('#tags-followed-content').append(tagView.render());
	
});