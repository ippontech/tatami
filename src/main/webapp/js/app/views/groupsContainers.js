(function(Backbone, _, Tatami){
    var GroupsSide = Backbone.Marionette.Layout.extend({
        template: "#GroupsSide",
        regions: {
            actions: {
                selector: ".actions"
            },
            tagTrends: {
                selector: ".tagTrends"
            },
            stats: {
                selector: ".stats"
            },
            informations: {
                selector: ".informations"
            }
        }
    });

    var GroupsBody = Backbone.Marionette.Layout.extend({
        template: "#GroupsBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        },
        serializeData: function(){
            return this.options;
        },
        show: function(tabName){
            this.$el.find('.groupsbody-nav > li').removeClass('active');
            this.$el.find('.groupsbody-nav > li.' + tabName).addClass('active');
        }
    });

    var GroupsHeader = Backbone.Marionette.ItemView.extend({
        template: '#GroupsHeader',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        }
    });

    Tatami.Views.GroupsHeader = GroupsHeader;
    Tatami.Views.GroupsSide = GroupsSide;
    Tatami.Views.GroupsBody = GroupsBody;
})(Backbone, _, Tatami);