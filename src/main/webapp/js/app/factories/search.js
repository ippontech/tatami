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
            if(searchModel==null)
                searchModel = new Tatami.Models.Search({"input": input});
            var searcHeader = new Tatami.Views.SearchHeader({model: searchModel});

            return searcHeader;
        }
    };

})(Backbone, Tatami);