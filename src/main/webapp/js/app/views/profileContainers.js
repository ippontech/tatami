(function(Backbone, _, Tatami){
    var ProfileSide = Backbone.Marionette.Layout.extend({
        template: "#ProfileSide",
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

    var ProfileBody = Backbone.Marionette.Layout.extend({
        template: "#ProfileBody",
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        },
        serializeData: function(){
            return this.options;
        },
        show: function(tabName){
            this.$el.find('.profilebody-nav > li').removeClass('active');
            this.$el.find('.profilebody-nav > li.' + tabName).addClass('active');
        }
    });

    var ProfileHeader = Backbone.Marionette.ItemView.extend({
        template: '#ProfileHeader',
        modelEvents: {
            'change': 'render',
            'sync': 'render'
        },
        events: {
            'click .toggleFriend': 'toggleFriend'
        },
        toggleFriend: function(){
            this.model.save({
                friend: !this.model.get('friend')
            }, {
                patch: true
            });
        }
    });

    Tatami.Views.ProfileHeader = ProfileHeader;
    Tatami.Views.ProfileSide = ProfileSide;
    Tatami.Views.ProfileBody = ProfileBody;
})(Backbone, _, Tatami);