(function(Backbone, Tatami){

    var Groups = Backbone.Collection.extend({
        url: '/tatami/rest/groups',
        model: Tatami.Models.Group
    });

    Tatami.Collections.Groups = Groups;

})(Backbone, Tatami);