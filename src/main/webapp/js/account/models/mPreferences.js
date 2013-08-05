
var MPreferences = Backbone.Model.extend({
    url: '/tatami/rest/account/preferences',

    defaults: {
        mentionEmail: '',
        dailyDigest :'',
        weeklyDigest : '',
        rssUidActive : '',
        rssUid : ''
    }
});