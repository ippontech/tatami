/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 09:49
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){
var CFiles = Backbone.Collection.extend({
    model: MFile,
    url: '/tatami/rest/attachments',

    initialize: function(){

    }
});
//})(Backbone, Tatami);