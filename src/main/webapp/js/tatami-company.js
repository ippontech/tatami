
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
  Initialization
*/
app.Router.ProfileRouter = Backbone.Router.extend({

  initialize: function() {
    var statuscollection = new app.Collection.StatusCollection();
    statuscollection.url = '/tatami/rest/company';
    app.views.status = new app.View.TimeLinePanelView({
      autoRefresh : true,
      model: statuscollection
    });

    $('#mainPanel').html(app.views.status.render());
  }
});

$(function() {

  app.router = new app.Router.ProfileRouter();
  Backbone.history.start();

});