(function(Backbone, Tatami){

    var Mentions = Backbone.Model.extend({

        urlRoot: '/tatami/rest/mentions'

    });

    Tatami.Models.Mentions = Mentions;

})(Backbone, Tatami);
