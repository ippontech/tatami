(function(Backbone, _, Tatami){
    HomeSide = Backbone.Marionette.Layout.extend({
        template: "#HomeSide",
        regions: {
            cardProfile: {
                selector: ".card-profile"
            },
            tagTrends: {
                selector: ".tag-trends"
            },
            groups: {
                selector: ".groups"
            }
        }
    });

    Tatami.Views.HomeSide = HomeSide;
})(Backbone, _, Tatami);