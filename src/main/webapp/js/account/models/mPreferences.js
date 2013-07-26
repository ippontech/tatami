
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