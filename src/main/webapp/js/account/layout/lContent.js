
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
