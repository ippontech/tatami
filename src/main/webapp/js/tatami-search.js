
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
      window.location = '/tatami/#/search/' + search;
  }
});

$(function() {

  app.views.searchFromHeaderView = new app.View.SearchFormHeaderView({
    el: $('#searchHeader')
  });

});