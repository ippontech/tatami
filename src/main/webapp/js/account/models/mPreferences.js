/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 17:05
 * To change this template use File | Settings | File Templates.
 */
//(function(Backbone, Tatami){

var MPreferences = Backbone.Model.extend({
    url: '/tatami/rest/account/preferences',

    //Ne prends pas les valeurs préenegistré
    defaults: {
        mentionEmail: '',
        dailyDigest :'',
        weeklyDigest : '',
        rssUidActive : '',
        rssUid : ''
    } //,


});
//})(Backbone, Tatami);