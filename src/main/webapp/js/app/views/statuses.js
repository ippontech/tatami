(function(Backbone, _, Tatami){
    StatusItems = Backbone.Marionette.Layout.extend({
        initialize: function(){
            _.defaults(this.options, {
                discussion: true
            });
        },
        updateDetailModel: function(model, id){
            this.options.details.set('statusId', id);
        },
        className: 'tatam',
        template: '#StatusItems',
        regions: {
            footer: 'footer'
        },
        modelEvents: {
            'sync': 'slide',
            'change:statusId': 'updateDetailModel'
        },
        events: {
            'click > .well': 'showDetails',
            'click > footer > div > aside > .status-action-reply': 'replyAction',
            'click > footer > div > aside > .status-action-share': 'shareAction',
            'click > footer > div > aside > .status-action-favorite': 'favoriteAction'
        },
        slide: function(){
            this.$el.slideDown();
        },
        onRender: function(){
            this.$el.toggleClass('favorite', this.model.get('favorite'));
            this.$el.toggleClass('discute', this.model.get('detailsAvailable'));
        },
        showDetails: function(){
            var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);

            if(!this.footer.currentView){
                this.footer.show(new StatusFooters({
                    model: statusDetail,
                    discussion: this.options.discussion
                }));
                statusDetail.fetch();
            }
            else this.footer.currentView.$el.slideToggle();
        },
        replyAction: function(){
            console.log('reply');
            return false;
        },
        favoriteAction: function(){
            var self = this;
            this.model.save({
                favorite: !this.model.get('favorite')
            }, {
                patch: true,
                success: function(){
                    self.onRender();
                }
            });
            return false;
        },
        shareAction: function(){
            var self = this;
            this.model.save({
                shared: !this.model.get('shared')
            }, {
                patch: true,
                success: function(){
                    self.refreshDetails();
                }
            });
            return false;
        }
    });

    StatusFooters = Backbone.Marionette.Layout.extend({
        initialize: function(){
            this.$el.css('display', 'none');

            var self = this;
            this.slideDown = _.debounce(function(){
                console.log('slide');
                self.$el.slideDown();
            }, jQuery.fx.speeds._default);
        },
        template: "#StatusFooters",

        regions: {
            share: ".tatams-share",
            discute: ".tatams-discute"
        },

        modelEvents: {
            'sync': 'onRender'
        },

        onRender: function(){
            var shares = this.model.get('sharedByLogins');
            if(shares && shares.length > 0){
                this.share.show(new Tatami.Views.StatusShares({
                    collection: new Backbone.Collection(shares)
                }));
            }

            var discute = this.model.get('discussionStatuses');
            if(this.options.discussion && discute && discute.length > 0){
                this.discute.show(new Tatami.Views.Statuses({
                    collection: new Tatami.Collections.Statuses(discute),
                    itemViewOptions: {
                        discussion: false
                    }
                }));
            }

            this.slideDown();
        }
    });

    Statuses = Backbone.Marionette.CollectionView.extend({
        className: 'tatams',
        itemView: StatusItems,
        onAfterItemAdded: function(itemView){
            itemView.slide();
        }
    });

    Tatami.Views.Statuses = Statuses;
    Tatami.Views.StatusItems = StatusItems;
    Tatami.Views.StatusFooters = StatusFooters;
})(Backbone, _, Tatami);