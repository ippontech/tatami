(function(Backbone, Tatami){

    var Tags = Backbone.Collection.extend({
        url: '/tatami/rest/tags',
        model: Tatami.Models.Tags
    });

    Tatami.Collections.Tags = Tags;

})(Backbone, Tatami);