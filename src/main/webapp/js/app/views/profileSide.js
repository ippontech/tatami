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

    var ProfileActions = Backbone.Marionette.ItemView.extend({
        template: '#ProfileActions',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    var ProfileInformations = Backbone.Marionette.ItemView.extend({
        template: '#ProfileInformations',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    var ProfileStats = Backbone.Marionette.ItemView.extend({
        template: '#ProfileStats',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    var ProfileTagTrends = Backbone.Marionette.ItemView.extend({
        template: '#ProfileTagTrends',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.ProfileActions = ProfileActions;
    Tatami.Views.ProfileInformations = ProfileInformations;
    Tatami.Views.ProfileStats = ProfileStats;
    Tatami.Views.ProfileTagTrends = ProfileTagTrends;
})(Backbone, _, Tatami);