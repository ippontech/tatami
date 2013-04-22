(function(Backbone, Tatami){

    var Stats = Backbone.Model.extend({
        urlRoot: '/tatami/rest/stats'
    });

    Tatami.Models.Stats = Stats;

})(Backbone, Tatami);