(function(Backbone, Tatami){

    var Search = Backbone.Model.extend({

        defaults: {
            q:'',
            tags: '',
            status: '',
            groups:'',
            users:''
        },

        urlRoot: '/tatami/rest/search'

    });

    Tatami.Models.Search = Search;

})(Backbone, Tatami);
