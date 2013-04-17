(function(Backbone, Tatami){

    var Groups = Backbone.Model.extend({
        idAttribute :'groupId',
        defaults: {
            groupId:''
        },

        urlRoot: '/tatami/rest/groups'

    });

    Tatami.Models.Groups = Groups;

})(Backbone, Tatami);