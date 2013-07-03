/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 01/07/13
 * Time: 15:43
 * To change this template use File | Settings | File Templates.
 */


_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
};
var VAvatar = Marionette.ItemView.extend({
    template: "#template-avatar"
} );

var VNavigation = Marionette.ItemView.extend({
    template: "#template-navigation"
} );

var VContent = Marionette.ItemView.extend({
    template: "#template-content"
} );




