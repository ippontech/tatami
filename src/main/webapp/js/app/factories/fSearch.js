(function(Backbone, Tatami){

    var searchModel;

    Tatami.Factories.Search = {
        searchBody: function(input){          
            if(searchModel==null)
                searchModel = new Tatami.Models.Search({"input": input});
            var searchBody = new Tatami.Views.SearchBody({model: searchModel});

            return searchBody;
        },
        searchHeader: function(input){
            searchModel = new Tatami.Models.Search({"input": input});
            var vSearchHeader = new Tatami.Views.SearchHeader({model: searchModel});

            return vSearchHeader;
        },

        searchUsers: function(input){
           var c = new Tatami.Collections.SearchUsers();
            if(input) c.fetch({data: {q : input} });

            return  new Tatami.Views.UserList({
                collection: c,
                itemViewOptions:{desactivable:true}
            });
        },

        searchGroups: function(input){
            var c = new Tatami.Collections.SearchGroups();
            if(input) c.fetch({data: {q : input} });

            return  new Tatami.Views.GroupsList({
                collection: c
            });
        },

        searchTags: function(input){
            var c = new Tatami.Collections.SearchTags();
            if(input) c.fetch({data: {q : input} });

            return  new Tatami.Views.TagsList({
                collection: c
            });
        }
    };

})(Backbone, Tatami);