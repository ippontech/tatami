(function(Backbone, _, Tatami){
    var HomeSide = Backbone.Marionette.Layout.extend({
        template: "#HomeSide",
        regions: {
            cardProfile: {
                selector: ".card-profile"
            },
            tagTrends: {
                selector: ".tag-trends"
            },
            whoToFollow: {
                selector: ".who-to-follow"
            },
            groups: {
                selector: ".groups"
            }
        }
    });

    var HomeBody = Backbone.Marionette.Layout.extend({
        template: "#HomeBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            },
            welcome: {
                selector: ".welcome"
            }
        },
        show: function(tabName){
            this.$el.find('.homebody-nav a[href="#' + tabName + '"]').tab('show');
        }
    });

    var HomeHeader = Backbone.Marionette.ItemView.extend({
        template: '#HomeHeader',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.HomeHeader = HomeHeader;
    Tatami.Views.HomeSide = HomeSide;
    Tatami.Views.HomeBody = HomeBody;
})(Backbone, _, Tatami);