/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 15:16
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){


var CDailyStat = Backbone.Collection.extend({
    url:'/tatami/rest/stats/day',
    defaults :{
        "username" : '',
        "statusCount" : ''
    }
});
//})(Backbone, Tatami);