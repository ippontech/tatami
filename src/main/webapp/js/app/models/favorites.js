(function(Backbone, Tatami){

    var Favorites = Backbone.Model.extend({
        idAttribute:'statusId',

        defaults: {
            statusId:''
        },

        urlRoot: '/tatami/rest/favorites'

    });

    Tatami.Models.Favorites = Favorites;

})(Backbone, Tatami);