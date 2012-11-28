
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

  /*
    Search form in the top menu.
  */

app.View.SearchFormHeaderView = Backbone.View.extend({
  initialize: function(){
  },
  
  events: {
    'submit' : 'submit'
  },

  submit: function(e) {
    e.preventDefault();

    var search = null;

    _.each($(e.target).serializeArray(), function(input){
      if(input.name === 'search')
        search = input.value;
    });
    if(search){
    	 window.location = '/tatami/#/search/' + search;
    }
     
  }
});


var searchFromHeaderView = new app.View.SearchFormHeaderView({
	el: $('#searchHeader') 
});
   

app.View.switchSearchAgent = Backbone.View.extend({
	initialize: function(){
		this.template = $('.switch-search-agent').children('i');
	},
	
	el:'#search-contener',
	
	events:{
		'click .user-selected':'render',
		'click .tags-selected':'render',
	},
	
	render: function(e){
		var item = e.currentTarget.className;

		if(item == 'user-selected')
		{
			this.template.attr('class','icon-user');
		}
		else if(item == 'tags-selected')
		{
			this.template.attr('class','icon-tags');
		}
	}
	
});

var agent = new app.View.switchSearchAgent();
