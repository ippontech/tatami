_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

var app;

if(!window.app){
  app = window.app = _.extend({
    views: {},
    View: {},
    Collection: {},
    Model: {},
    Router: {},
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
    initialize: function() {

    },

    render: function() {
    	var template = _.template($('#tags-followed-template-item').html());
        var $el = $(this.el);
        $el.html(template({tags:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.TagsView = Backbone.View.extend({
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
    	var template =_.template($('#tags-followed-template').html());
    	$(this.el).empty();
        if(this.model.length > 0) {
        	_.each(this.model.models, this.addItem, this);
        }    
        else {
        	$(this.el).html(template);
        }
        return $(this.el);
    },

});


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
    initialize: function() {

    },

    render: function() {
    	var template = _.template($('#popular-tags-template-item').html());
        var $el = $(this.el);
        $el.html(template({tags:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.TagsPopularView = Backbone.View.extend({
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
    	var template = _.template($('#popular-tags-template').html());
    	
    	$(this.el).empty();
        if(this.model.length > 0) {
        	_.each(this.model.models, this.addItem, this);
        }    
        else {
        	$(this.el).html(template);
        }
        return $(this.el);
    }

});


/*
 * Groups
 * 
 */

app.Collection.GroupsCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/groups';
    },
    parse: function(response){
    	
    	var admin = response.groupsAdmin;
    	var groups = response.groups;
    
    	for(var i = 0; i < groups.length; i++)
    	{
    		for(var x = 0; x < admin.length; x++)
        	{
        		
    			if(admin[x].groupId == groups[i].groupId){
    				
    				console.log('vous etes admin');
    				
    				groups[i].admin = true;
    				
    			}
    			
    			
    			//console.log(admin[x].groupId);
        	}
    	  		
    		console.log(groups[i]);
    		
    	}
    	
    	//return response;
    }
});

app.View.MyOwnGroupsView = Backbone.View.extend({
    initialize: function() {

    },

    tagName: 'tr',
    
    render: function() {
    	var template = _.template($('#own-groups-template-item').html());
        var $el = $(this.el);
        $el.html(template({groups:this.model.toJSON()}));
        return $(this.el);
    }
});

app.View.myGroups = Backbone.View.extend({	
    initialize: function() {
        this.model = new app.Collection.GroupsCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
        $(this.el).addClass('table table-striped');
    },
    
    tagName: 'table',

    addItem: function(item, index) {
    	var el = new app.View.MyOwnGroupsView({
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
        _.each(this.model.models, this.addItem, this);

        return $(this.el);
    }
});


var AdminRouter = Backbone.Router.extend({
	
	initialize: function(){
		
	},
	
	selectMenu: function(menu) {
		$('.adminMenu a').parent().removeClass('active');
		$('.adminMenu a[href="#/' + menu + '"]').parent().addClass('active');
	},
	
	routes: {
		"account-groups": "account_groups",
		"popular-groups": "popular_groups",
		"account-tags":"account_tags",
		"popular-tags":"popular_tags",
		"account-users":"account_users",
		"popular-users":"popular_users",	
		"*action": "account_groups",
	},
	
	account_groups: function(){
		this.selectMenu('account-groups');
		$('#admin-content').empty();
		
		app.views.groups = new app.View.myGroups();	
		$('#admin-content').append(app.views.groups.render());
	},
	
	popular_groups: function(){
		this.selectMenu('popular-groups');
		$('#admin-content').empty();
	},

	account_tags: function(){
		this.selectMenu('account-tags');
		$('#admin-content').empty();
		
		app.views.tagsview = new app.View.TagsView();
		$('#admin-content').append(app.views.tagsview.render());
		
	},
	
	popular_tags: function(){
		this.selectMenu('popular-tags');
		$('#admin-content').empty();
		
		app.views.tagsPopularview = new app.View.TagsPopularView();
		$('#admin-content').append(app.views.tagsPopularview.render());	
	},
	
	account_users: function(){
		console.log('user followed');
	},
	
	popular_users: function(){
		console.log('popular user');
	}
	
});



$(function() {
	
	app.admin = new AdminRouter(); 	
	Backbone.history.start();

});
