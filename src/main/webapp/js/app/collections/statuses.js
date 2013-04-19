(function(Backbone, Tatami){

    var Statuses = Backbone.Collection.extend({
        model: Tatami.Models.Statuses,
        url: '/tatami/rest/statuses/home_timeline'
    });

    Tatami.Collections.Statuses = Statuses;

})(Backbone, Tatami);