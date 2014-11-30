(function(Backbone, Tatami){

    var Tags = Backbone.Collection.extend({
        url: '/tatami/rest/tags',
        model: Tatami.Models.Tag
    });

    var TagsFollow = Tags.extend({
        url: function(){
            return '/tatami/rest/tags';
        }
    });

    var TagsRecommended = Tags.extend({
        url: function(){
            return '/tatami/rest/tags/popular';
        }
    });


    Tatami.Collections.Tags = Tags;
    Tatami.Collections.TagsFollow = TagsFollow;
    Tatami.Collections.TagsRecommended = TagsRecommended;

})(Backbone, Tatami);

