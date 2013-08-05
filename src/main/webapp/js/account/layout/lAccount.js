var AccountContainer = new Backbone.Marionette.Region({
    el: "#the-container"
});

var AccountLayout = Backbone.Marionette.Layout.extend({
    template: "#template-account",

    regions: {
        avatar: "#avatar",
        navigation: "#navigation"
    }
});
