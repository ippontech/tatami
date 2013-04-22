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

    HomeBody = Backbone.Marionette.Layout.extend({
        template: "#HomeBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        },
        show: function(tabName){
            this.$el.find('.homebody-nav a[href="#' + tabName + '"]').tab('show');
        }
    });

    Tatami.Views.HomeSide = HomeSide;
    Tatami.Views.HomeBody = HomeBody;
})(Backbone, _, Tatami);