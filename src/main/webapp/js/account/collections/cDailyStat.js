
var CDailyStat = Backbone.Collection.extend({
    url:'/tatami/rest/stats/day',
    defaults :{
        "username" : '',
        "statusCount" : ''
    }
});