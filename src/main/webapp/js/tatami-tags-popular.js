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
 * Popular Tags
 * 
 */

app.Collection.TagCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/tags';
    }
});

app.View.PopularTagsView = Backbone.View.extend({
	template: _.template($('#popular-tags-template-item').html()),
	
    initialize: function() {

    },

    render: function() {
        var $el = $(this.el);
        $el.html(this.template({tags:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.TagsPopularView = Backbone.View.extend({
	template: _.template($('#popular-tags-template').html()),
    initialize: function() {
        this.model = new app.Collection.TagCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
    },

    addItem: function(item, index) {
    	var el = new app.View.PopularTagsView({
    		model: item
    	}).render();

        if(index === 0) {
        	$(this.el).prepend(el);
        } 
        else {
        	$(this.el).append(el);
        }         
    },

    render: function() {
    	$(this.el).empty();
        if(this.model.length > 0) {
        	_.each(this.model.models, this.addItem, this);
        }    
        else {
        	$(this.el).html(this.template);
        }
        return $(this.el);
    },

});

$(function () {

	app.views.tagsPopularview = new app.View.TagsPopularView();
	$('#popular-tags-content').append(app.views.tagsPopularview.render());
  
});
