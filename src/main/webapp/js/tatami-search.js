
_.templateSettings = {
    interpolate: /<\@\=(.+?)\@\>/gim,
    evaluate: /<\@(.+?)\@\>/gim
};

var app;

if(!window.app){
    app = window.app = _.extend({
        views: {},
        collections: {},
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
    
    if(search)
      window.location = '/tatami/#/search/status/' + search;
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
		'click .tags-selected':'render'
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

function SearchEngine(){


    this.menu = '<ul class="typeahead dropdown-menu hasCategory"></ul>';

    this.source = function(query,process){
        $.getJSON('/tatami/rest/search/all', {q: query}, function(model){
            var data = [];
            data.push(model);
            return process(data);
        });
    };

    this.matcher = function (item) {
        return item;
    };

    this.sorter = function (items) {
        var data = [];
        items = items[0];

        items.tags.forEach(function(v){
            var obj = {};
            obj.label = '#'+v;
            obj.category = "tags";
            data.push(obj);
        });

        items.users.forEach(function(v){
            var obj = {};
            obj.label = '@'+v.username;
            obj.fullName = v.firstName+' '+ v.lastName;
            obj.gravatar = v.gravatar;
            obj.category = "users";
            data.push(obj);
        });

        items.groups.forEach(function(v){
            var obj = {};
            obj.label = v.name;
            obj.id = v.groupId;
            obj.nb = v.counter;
            obj.category = "groups";
            data.push(obj);
        });

        return data;
    };

    this.highlighter = function (item) {
       return true;
    };

    this.render = function(items){
        this.$menu.empty();

        var category = _.template($('#search-category').html()),
            templateItems = _.template($('#search-category-item').html()),
            self = this,
            currentCategory = "";

        _.each(items, function(item) {

            var menu, i;

            if ( item.category != currentCategory ) {
                 currentCategory = item.category;
                 menu = category({cat: item});
                 self.$menu.append(menu);
            }

            switch(currentCategory){
                case 'users':
                    i = templateItems({item: item});
                break;
                case 'groups':
                    i = templateItems({item: item});
                break;
                default:
                    i = templateItems({item: item});
                break;
            }
            self.$menu.append(i);
        });

        this.$menu.children('li.category').next().addClass('first');

        return this;
    };

    this.select = function () {
        var val = this.$menu.find('.active').attr('data-value'),
            groupId =  this.$menu.find('.active').attr('rel');
        this.$element.val(this.updater(val)).change();

        switch(val.charAt(0)){
            case '#':
               window.location = '/tatami/#/tags/'+val.substr(1);
            break;
            case '@':
               window.location = '/tatami/profile/'+val.substr(1)+'/';
               break;
            default:
               window.location = '/tatami/#/groups/'+groupId;
            break;
        }
        return this.hide();
    };

    this.next = function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')

      if(!next.hasClass('item')) this.next();
    };

    this.prev = function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')

      if(!prev.hasClass('item')) this.prev();
    };

}

$(function(){
   $("#fullSearchText").typeahead(new SearchEngine());
});
