(function(Backbone, Tatami){

    var Groups = Backbone.Model.extend({
        urlRoot: '/tatami/rest/groups',
        idAttribute: 'groupId',
        defaults: {
            publicGroup: true,
            archivedGroup: false,
            name: '',
            description: '',
            counter: 0
        }
    });

    Tatami.Models.Groups = Groups;

})(Backbone, Tatami);