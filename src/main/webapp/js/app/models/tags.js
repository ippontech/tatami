(function(Backbone, Tatami){

    var Tags = Backbone.Model.extend({
        urlRoot: '/tatami/rest/tags',
        idAttribute: 'name',
        defaults: {
            followed: false,
            trendingUp: false
        }
    });

    Tatami.Models.Tags = Tags;

})(Backbone, Tatami);