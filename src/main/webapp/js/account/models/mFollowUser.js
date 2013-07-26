
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