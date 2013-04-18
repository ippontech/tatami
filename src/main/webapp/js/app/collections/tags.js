(function(Backbone, Tatami){

    var Tags = Backbone.Collection.extend({
        url: '/tatami/rest/new/tags',
        parse: function(data){
            return data.tagList;
        },
        model: Tatami.Models.Tags
    });

    Tatami.Collections.Tags = Tags;

})(Backbone, Tatami);