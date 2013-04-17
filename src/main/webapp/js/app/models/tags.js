(function(Backbone, Tatami){

    var Tags = Backbone.Model.extend({

        defaults: {
            tag: '',
            type: ''
        },

        urlRoot: '/tatami/rest/tag'

    });

    Tatami.Models.Tags = Tags;

})(Backbone, Tatami);