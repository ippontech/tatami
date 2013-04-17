(function(Backbone, Tatami){

    var Friendships = Backbone.Model.extend({
        idAttribute:'screen_name',

        defaults: {
            screen_name:'',
            email: true,
            check: true
        },

        urlRoot: '/tatami/rest/friendships'

    });

    Tatami.Models.Friendships = Friendships;

})(Backbone, Tatami);