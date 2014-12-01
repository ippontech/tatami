(function(Backbone, Tatami){

    var Search = Backbone.Model.extend({
        defaults: {
            input: ''
        }
    });

    Tatami.Models.Search = Search;

})(Backbone, Tatami);