/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
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


// Show the "layout" in the "container" region
accountLayout = new AccountLayout();
AccountContainer.show(accountLayout);


accountLayout.avatar.show(new VAvatar());
accountLayout.navigation.show(new VNavigation());
accountLayout.content.show(new VContent());


$(function() {

 app.router = new AdminRouter();
 if( ! Backbone.History.started) Backbone.history.start();

});


