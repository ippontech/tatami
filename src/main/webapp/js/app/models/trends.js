(function(Backbone, Tatami){

    var Trends = Backbone.Model.extend({
        idAttribute: 'username',

        urlRoot: '/tatami/rest/trends'

    });

    Tatami.Models.Trends = Trends;

})(Backbone, Tatami);