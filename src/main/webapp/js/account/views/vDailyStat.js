/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 28/06/13
 * Time: 14:38
 * To change this template use File | Settings | File Templates.
 */



var VDailyStats = Backbone.View.extend({
    initialize:function () {
        var self = this;
        this.model = new CDailyStat();
        this.model.bind('reset', this.render, this);
        this.model.fetch({
            success: function() {
                self.render();
            }
        });
        $(window).bind("resize.app", _.bind(this.render, this));
    },

    render:function () {
        var values = [];
        var labels = [];
        this.model.each(function (model) {
            values.push(model.get('statusCount'));
            labels.push(model.get('username'));
        });
        this.$el.pie(values, labels);

        return this.$el;
    }
});