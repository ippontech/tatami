/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 09:46
 * To change this template use File | Settings | File Templates.
 */
//(function(Backbone, Tatami){
var MFile = Backbone.Model.extend({
    idAttribute: 'attachmentId',
    initialize: function(){
    }
});

var MQuota = Backbone.Model.extend({
    url : '/tatami/rest/attachments/quota',

    parse : function(data){  /// [56]
        var response = {};

        response.quota = data[0];

        return response;
    },

    defaults:
    {
        quota : ''
    }
});
//})(Backbone, Tatami);