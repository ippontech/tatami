/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 15:32
 * To change this template use File | Settings | File Templates.
 */


//(function(Backbone, Tatami){
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
//})(Backbone, Tatami);