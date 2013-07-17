var AccountContainer = new Backbone.Marionette.Region({
    el: "#the-container"
});

var AccountLayout = Backbone.Marionette.Layout.extend({
    template: "#template-account",

    regions: {
        avatar: "#avatar",
        navigation: "#navigation"
        //content: "#content"
        //Ajout future des messages d'erreurs/validation (en haut au milieu de l'écran)
    }
});
