
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

function SearchEngine(query){
    this.source = function(query,process){
        $.getJSON('/tatami/rest/search/all', {q: query}, function(model){
            var data = [];
            data.push(model);
            return process(data);
        });
    },

    this.matcher = function (item) {
        return item;
    },

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
    },

    this.highlighter = function (item) {
       switch(item){
           case 'tags':
               item = '<i class="icon-tags"></i>';
               break;
           case 'users':
               item = '<i class="icon-user"></i>';
               break;
           case 'groups':
               item = '<i class="icon-th-large"></i>';
           break;
       }
       return item;
    },

    this.render = function(items){
        this.$menu.empty();

        var category = _.template($('#search-category').html()),
            users = _.template($('#search-users').html()),
            tags = _.template($('#search-tags').html()),
            groups = _.template($('#search-groups').html()),
            self = this,
            currentCategory = "";

        $.each( items, function( index, item ) {
            var menu, i;

            if ( item.category != currentCategory ) {
                    currentCategory = item.category;
                    menu = category({current: item.category, category: self.highlighter(item.category)});
            }
            self.$menu.append(menu);

            switch(currentCategory){
                case 'users':
                    i = users({user: item.label, img: '/img/default_image_profile.png', fullname: item.fullName});
                break;
                case 'groups':
                    i = groups({group: item.label, id: item.id, img:'/img/default_image_profile.png', nb: item.nb});
                break;
                default:
                    i = tags({tag: item.label});
                break;
            }
            self.$menu.append(i);
        });

        $(this.$menu).children('li.category').next().addClass('first');

        return this
    },

    this.select = function () {
        var val = this.$menu.find('.active').attr('data-value');
        var groupId =  this.$menu.find('.active').attr('rel');
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
        return this.hide()
    }

}

$(function(){
   $("#fullSearchText").typeahead(new SearchEngine($("#fullSearchText")));
})
