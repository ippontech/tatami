/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 09:46
 * To change this template use File | Settings | File Templates.
 */

var MFile = Backbone.Model.extend({
    idAttribute: 'attachmentId',
    initialize: function(){

    }
});

var MQuota = Backbone.Model.extend({
    url : '/tatami/rest/attachments/quota'
});