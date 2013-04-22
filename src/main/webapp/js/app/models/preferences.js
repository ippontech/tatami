(function(Backbone, Tatami){

    var Preferences = Backbone.Model.extend({
        urlRoot: '/tatami/rest/preferences'
    });

    Tatami.Models.Preferences = Preferences;

})(Backbone, Tatami);
