/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
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



$(function() {

 app.router = new AdminRouter();
 if( ! Backbone.History.started) Backbone.history.start();

});

