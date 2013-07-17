/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 13:59
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){
var MFollowUser = Backbone.Model.extend({
    url : function(){
        return '/tatami/rest/friendships/create';
    }
});

var MUnFollowUser = Backbone.Model.extend({
    url : function(){
        return '/tatami/rest/friendships/destroy';
    }
});
//})(Backbone, Tatami);