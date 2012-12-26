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
    Router: {}
  }, Backbone.Events);
}
else {
  app = window.app;
}


/** Global Template **/
app.View.DefaultView = Backbone.View.extend({
    initialize: function() {

    },

    render: function() {
        var $el = $(this.el);
        $el.html(this.options.template({elem:this.model.toJSON()}));
        return $(this.el);
    }
});


/*
 * Tags directory, delivery tags following
 * 
 */

app.Collection.TagCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/tagmemberships/list';
    }
});

app.Model.DeletedTagModel = Backbone.Model.extend({
	url : function(){
		return '/tatami/rest/tagmemberships/destroy';
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
    		el = new app.View.DefaultView({
                model: item,
                template: _.template($('#tags-followed-template-item').html())
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
        _.each(this.model.models, this.addItem, this);
        return $(this.el);
    }
});


/*
 * Popular Tags
 * 
 */

app.Collection.TagCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/tags/popular';
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
    	var el = new app.View.DefaultView({
    		model: item,
    		template: _.template($('#popular-tags-template-item').html())
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
 
    	for(var i in groups)
    	{
    		for(var x in admin)
        	{
    			if(groups[i].groupId == admin[x].groupId){
    				groups[i].admin = true;	
    			} 		
        	}
    	} 	
    	return groups;
    }
});

app.View.myGroups = Backbone.View.extend({	
	template: _.template($('#own-groups-template').html()),
	
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
    	var el = new app.View.DefaultView({
    		model: item,
    		template: _.template($('#own-groups-template-item').html()),
    		tagName: 'tr'
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
    	$(this.el).append(this.template());
        _.each(this.model.models, this.addItem, this);
        return $(this.el);
    }
});

app.Collection.recommendedGroups = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/groupmemberships/suggestions';
    }
});

app.View.recommendedGroups = Backbone.View.extend({
	template: _.template($('#own-groups-template').html()),
	
    initialize: function() {
        this.model = new app.Collection.recommendedGroups();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
        $(this.el).addClass('table table-striped');
    },
    
    tagName: 'table',

    addItem: function(item, index) {
    	var el = new app.View.DefaultView({
    		model: item,
    		template: _.template($('#own-groups-template-item').html()),
    		tagName: 'tr'
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
    	$(this.el).append(this.template());
        _.each(this.model.models, this.addItem, this);
        return $(this.el);
    }
});

/*
 * Users 
 * 
 */

app.Collection.usersCollection = Backbone.Collection.extend({
    url : function(){
        return '/tatami/rest/users';
    }
});

app.View.allUser = Backbone.View.extend({	
	template: _.template($('#global-users-template').html()),
	
    initialize: function() {
        this.model = new app.Collection.usersCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
        $(this.el).addClass('table table-striped');
    },
    
    tagName: 'table',

    addItem: function(item, index) {
    	var el = new app.View.DefaultView({
    		model: item,
    		template: _.template($('#global-users-template-item').html()),
    		tagName: 'tr'
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
    	$(this.el).append(this.template());
        _.each(this.model.models, this.addItem, this);
        return $(this.el);
    }
});

/* TO DO */
app.Collection.popularUsersCollection = Backbone.Collection.extend({
    url : function(){
        return '';
    }
});

app.View.popularUsers = Backbone.View.extend({
	template: _.template($('#global-users-template').html()),
	
    initialize: function() {
        this.model = new app.Collection.usersCollection();
        this.model.bind('reset', this.render, this);
        this.model.bind('add', function(model, collection, options) {
            self.addItem(model, options.index);
        }, this);
        this.model.fetch();
        $(this.el).addClass('table table-striped');
    },
    
    tagName: 'table',

    addItem: function(item, index) {
    	var el = new app.View.DefaultView({
    		model: item,
    		template: _.template($('#global-users-template-item').html()),
    		tagName: 'tr'
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
    	$(this.el).append(this.template());
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
		"*action": "account_groups"
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
		
		/*TO DO : replace by true popular groups*/
		app.views.groups = new app.View.recommendedGroups();
		$('#admin-content').append(app.views.groups.render());
		
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
		this.selectMenu('account-users');
		$('#admin-content').empty();
		
		app.views.allUserView = new app.View.allUser();	
		$('#admin-content').append(app.views.allUserView.render());	
	},
	
	popular_users: function(){
		this.selectMenu('popular-users');
		$('#admin-content').empty();
		
		/* TO DO : replace by true popular users*/
		app.views.popularUsers = new app.View.popularUsers();	
		$('#admin-content').append(app.views.popularUsers.render());	
	}
	
});


$(function() {
	
	app.admin = new AdminRouter(); 	
	Backbone.history.start();

});
