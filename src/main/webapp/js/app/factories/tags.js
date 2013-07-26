(function(Backbone, Tatami){

    var tags = new (Backbone.Collection.extend({
        model : Tatami.Models.Tag
    }))();

    var tagsBody, tagsHeader;

    Tatami.Factories.Tags = {
        tagsBody: function(tagName){          
            tagsBody = new Tatami.Views.TagsBody();

            return tagsBody;
        },
        tagsHeader: function(tagName){
            var tag = tags.get(tagName);
            if(!tag){
                tag = new Tatami.Models.Tag({
                    name: tagName
                });
                tags.add(tag);
                tag.fetch({
                    error: function(){
                        Tatami.app.router.defaults();
                    }
                });
            }

            return new Tatami.Views.TagsHeader({
              model: tag
            });
        }



    };

})(Backbone, Tatami);