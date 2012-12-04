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
		console.log('menu my groups');		
	},
	
	popular_groups: function(){
		console.log('groupes populaire');
	},
	
	account_tags: function(){
		console.log('tags followed');
	},
	
	popular_tags: function(){
		console.log('popular tags');
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
