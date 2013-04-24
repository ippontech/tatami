(function(Backbone, Tatami){

    var Groups = Backbone.Collection.extend({
        url: '/tatami/rest/groups',
        model: Tatami.Models.Groups
    });

    Tatami.Collections.Groups = Groups;

})(Backbone, Tatami);