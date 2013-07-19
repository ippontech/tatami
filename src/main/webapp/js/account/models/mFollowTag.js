

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