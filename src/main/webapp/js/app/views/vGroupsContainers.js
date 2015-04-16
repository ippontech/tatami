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

    var GroupsHeader = Backbone.Marionette.ItemView.extend({
        template: '#GroupsHeader',

        modelEvents: {
            'change': 'render',
            'sync': 'render'
        },
        events: {
            'click .toggleTag': 'subscription'
        },
        subscription: function(event){
            this.model.url = this.model.urlRoot+'/'+this.model.id+'/members/'+Tatami.app.user.id;
            var model = this.model;
            if(this.model.get('member')){                
                this.model.destroy();
                this.model.set('member',false);
            } else {
                this.model.save();                
                this.model.set('member',true);
            }
        }
    });


    var GroupItemsDetails = Backbone.Marionette.ItemView.extend({
        template: '#groups-item',
        tagName : 'tr',

        modelEvents: {
            'change': 'render',
            'sync': 'render'
        },
        events: {
            'click .toggleGroup': 'subscription'
        },
        subscription: function(event){
            this.model.url = this.model.urlRoot+'/'+this.model.id+'/members/'+Tatami.app.user.id;
            var model = this.model;
            if(this.model.get('member')){
                this.model.destroy();
                this.model.set('member',false);
            } else {
                this.model.save();
                this.model.set('member',true);
            }
        }
    });

    var GroupsList  = Backbone.Marionette.CompositeView.extend({
        itemView: GroupItemsDetails,
        itemViewContainer: '.items',
        template :'#GroupsSuscribeTemplate'
    });

    Tatami.Views.GroupsList = GroupsList;
    Tatami.Views.GroupsHeader = GroupsHeader;
    Tatami.Views.GroupsSide = GroupsSide;
    Tatami.Views.GroupsBody = GroupsBody;
})(Backbone, _, Tatami);