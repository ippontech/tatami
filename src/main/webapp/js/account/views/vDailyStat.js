/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 28/06/13
 * Time: 14:38
 * To change this template use File | Settings | File Templates.
 */

var VDailyStats = Marionette.ItemView.extend({

    initialize:function () {
        var self = this;
        this.collection.fetch({
            success: function() {
                self.render();
            }
        });
        $(window).bind("resize.app", _.bind(this.render, this));
    },

      /*collectionEvents: {
        //'reset': 'render',
        'success' : 'myRender'
    },     */

    render:function () {
        var values = [];
        var labels = [];
        this.collection.each(function (collection) {
            values.push(collection.get('statusCount'));
            labels.push(collection.get('username'));
        });
        this.$el.pie(values, labels);

        return this.$el;
    }
});