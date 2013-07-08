/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 14:44
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){
var MFollowTag = Backbone.Model.extend({

    url : function(){
        return '/tatami/rest/tagmemberships/create';
    }
});

var MUnFollowTag = Backbone.Model.extend({
    url : function(){
        return '/tatami/rest/tagmemberships/destroy';
    }
});
//})(Backbone, Tatami);