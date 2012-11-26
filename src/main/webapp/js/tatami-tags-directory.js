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
 * Tags directory, delivery tags following
 * 
 */

app.Collection.TagCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/tags';
    }
});

app.Model.DeletedTagModel = Backbone.Model.extend({
	url : function(){
		return '/tatami/rest/tagmemberships/destroy';
	}
});

app.View.TagsItemView = Backbone.View.extend({
	template: _.template($('#tags-followed-template-item').html()),
	
    initialize: function() {

    },

    render: function() {
        var $el = $(this.el);
        $el.html(this.template({tags:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.TagsView = Backbone.View.extend({
	template: _.template($('#tags-followed-template').html()),
    initialize: function() {
        this.model = new app.Collection.TagCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
    },
    
    events:{
      'click .icon-remove':'deleted'
    },
    
    addItem: function(item, index) {
    	var el = null;
    	
    	if(item.attributes.followed === true){
    		el = new app.View.TagsItemView({
                model: item
            }).render();
    	}
        
        if(index === 0) {
        	$(this.el).prepend(el);
        } 
        else {
        	$(this.el).append(el);
        }         
    },
    
    deleted: function(e) {  	
    	
      var tag = $(e.target).parent().parent().attr('class');

  	  var m = new app.Model.DeletedTagModel();
  	  m.set('name', tag);
  	    	  
  	  m.save(null,{
  		  success: function(){
  			$(e.target).parent().parent().fadeOut('slow');
  		  },
  		  error: function(){
  			 // no action
  		  }
  	  });
  	  
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

/*
 * Popular Tags
 * 
 */

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

	app.views.tagsview = new app.View.TagsView();
	$('#tags-followed-content').append(app.views.tagsview.render());
	
});
