(function(Backbone, _, Tatami){
    var ProfileSide = Backbone.Marionette.Layout.extend({
        template: "#ProfileSide",
        regions: {
            actions: {
                selector: ".actions"
            },
            informations: {
                selector: ".informations"
            },
            stats: {
                selector: ".stats"
            },
            tagTrends: {
                selector: ".tagTrends"
            }
        }
    });

    var ProfileBody = Backbone.Marionette.Layout.extend({
        template: "#ProfileBody",
        regions: {
            header: {
                selector: ".tatams-content-title"
            },
            tatams: {
                selector: ".tatams-container"
            }
        },
        serializeData: function(){
            return this.options;
        },
        show: function(tabName){
            this.$el.find('.homebody-nav > li').removeClass('active');
            this.$el.find('.homebody-nav > li.' + tabName).addClass('active');
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
                friendShip:true,
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