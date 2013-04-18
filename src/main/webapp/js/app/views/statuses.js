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
            share: "footer > .tatams-share",
            discussion: "footer > .tatams-discute"
        },
        modelEvents: {
            'change': 'render',
            'sync': 'render slide',
            'change:statusId': 'updateDetailModel'
        },
        events: {
            'click > .well': 'showDetails',
            'click > footer > aside > .status-action-reply': 'reply',
            'click > footer > aside > .status-action-favorite': 'favorite',
            'click > footer > aside > .status-action-share': 'share'
        },
        slide: function(){
            this.$el.slideDown();
        },
        onRender: function(){
            this.$el.toggleClass('favorite', this.model.get('favorite'));
            this.$el.toggleClass('discute', this.model.get('detailsAvailable'));
        },
        showDetails: function(){
            var $footer = this.$el.find('> footer');
            if($footer.css('display') !== 'none') return $footer.slideToggle();

            var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
            this.share.show(Tatami.Factories.Status.statusShares(statusDetail));
            if(this.options.discussion){
                this.discussion.show(Tatami.Factories.Status.statusesDiscussion(statusDetail));
            }
            statusDetail.fetch({
                success: function(){
                    $footer.slideToggle();
                }
            });
        },
        reply: function(){
            console.log('reply');
            return false;
        },
        favorite: function(){
            var self = this;
            this.model.save({
                favorite: true
            }, {
                success: function(){
                    self.onRender();
                }
            });
            return false;
        },
        share: function(){
            console.log('share');
            return false;
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
})(Backbone, _, Tatami);