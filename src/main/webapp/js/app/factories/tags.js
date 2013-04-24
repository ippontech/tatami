(function(Backbone, Tatami){

    var tags = new (Backbone.Collection.extend({
        model : Tatami.Models.Tags
    }))();

    var tagsBody, tagsHeader;

    Tatami.Factories.Tags = {
        tagsBody: function(){
            if(!tagsBody) tagsBody = new Tatami.Views.TagsBody();

            return tagsBody;
        },
        tagsHeader: function(tagName){
            var tag = tags.get(tagName);
            if(!tag){
                tag = new Tatami.Models.Tags({
                    name: tagName
                });
                tags.add(tag);
                tag.fetch();
            }

            return new Tatami.Views.TagsHeader({
              model: tag
            });
        }
    };

})(Backbone, Tatami);