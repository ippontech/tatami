
//(function(Backbone, Tatami){
var CFiles = Backbone.Collection.extend({
    model: MFile,
    url: '/tatami/rest/attachments',

    initialize: function(){

    }
});
//})(Backbone, Tatami);