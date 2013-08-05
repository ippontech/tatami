
var MGroup = Backbone.Model.extend({
    urlRoot: '/tatami/rest/groups',
    idAttribute: 'groupId',
    defaults: {
        name: '',
        description: '',
        publicGroup: true,
        archivedGroup: false
    }
});