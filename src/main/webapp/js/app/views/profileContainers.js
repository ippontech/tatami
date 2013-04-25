(function(Backbone, _, Tatami){
    /*var ProfileSide = Backbone.Marionette.Layout.extend({
        template: "#ProfileSide",
        regions: {
            actions: {
                selector: ".actions-profile"
            },
            tagTrends: {
                selector: ".tag-trends"
            },
            stats: {
                selector: ".stats"
            },
            informations: {
                selector: ".informations"
            }
        }
    });

    var ProfileBody = Backbone.Marionette.Layout.extend({
        template: "#ProfileBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        },
        show: function(tabName){
            this.$el.find('.homebody-nav a[href="#' + tabName + '"]').tab('show');
        }
    });*/

    var ProfileHeader = Backbone.Marionette.ItemView.extend({
        template: '#ProfileHeader',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.ProfileHeader = ProfileHeader;
    //Tatami.Views.ProfileSide = ProfileSide;
    //Tatami.Views.ProfileBody = ProfileBody;
})(Backbone, _, Tatami);