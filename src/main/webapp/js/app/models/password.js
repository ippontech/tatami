(function(Backbone, Tatami){

    var Password = Backbone.Model.extend({
        urlRoot: '/tatami/rest/password'
    });

    Tatami.Models.Password = Password;

})(Backbone, Tatami);