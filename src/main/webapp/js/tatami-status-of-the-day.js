_.templateSettings = {
    interpolate:/<\@\=(.+?)\@\>/gim,
    evaluate:/<\@(.+?)\@\>/gim
};

var app;

if (!window.app) {
    app = window.app = _.extend({
        views:{},
        View:{},
        Collection:{},
        Model:{},
        Router:{}
    }, Backbone.Events);
}
else {
    app = window.app;
}

/*
 Statistics
 */

app.Collection.DailyStatCollection = Backbone.Collection.extend({
    url:'/tatami/rest/stats/day'
});

app.View.DailyStatsView = Backbone.View.extend({
    initialize:function () {
        this.model = new app.Collection.DailyStatCollection();
        this.model.bind('reset', this.render, this);
        this.model.fetch();
    },

    render:function () {

        var values = [];
        var labels = [];
        this.model.each(function (model) {
            values.push(model.get('statusCount'));
            labels.push(model.get('username'));
        });

        $(this.el).pie(values, labels);
        return $(this.el);
    }
});

$(function () {

    app.views.daily = new app.View.DailyStatsView();
    $('#piechart').empty();
    $('#piechart').append(app.views.daily.render());
});