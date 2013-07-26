
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






