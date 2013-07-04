/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 02/07/13
 * Time: 16:19
 * To change this template use File | Settings | File Templates.
 */
var ContentContainer = new Backbone.Marionette.Region({
    el: "#content-container"
});

var ContentLayout = Backbone.Marionette.Layout.extend({
    template: "#template-content",

    regions: {
        region1: "#region1",
        region2: "#region2",
        region3: "#region3",
        region4: "#region4",
        region5: "#region5"
    }
});
