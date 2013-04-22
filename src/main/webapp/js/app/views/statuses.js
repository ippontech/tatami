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
            footer: {
                selector: 'footer',
                regionType: Marionette.Region.extend({
                    open: function(view){
                        this.$el.css('display', 'none');
                        this.$el.html(view.el);
                    }
                })
            }
        },
        modelEvents: {
            'change:statusId': 'updateDetailModel',
            'change:favorite': 'onRender',
            'change:discute': 'onRender'
        },
        events: {
            'click > .well': 'showDetails',
            'click > footer > div > aside > .status-action-reply': 'replyAction',
            'click > footer > div > aside > .status-action-share': 'shareAction',
            'click > footer > div > aside > .status-action-favorite': 'favoriteAction'
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
            this.footer.$el.slideToggle();
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
            _.defaults(this.options, {
                discute: true,
                slide: true
            });

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
                if(this.share.currentView) this.share.currentView.collection.set(shares, {
                    remove: false
                });
                else this.share.show(new Tatami.Views.StatusShares({
                    collection: new Backbone.Collection(shares)
                }));
            }

            var discute = this.model.get('discussionStatuses');
            if(this.options.discussion && discute && discute.length > 0){
                if(this.discute.currentView) this.discute.currentView.collection.set(discute, {
                    remove: false
                });
                else this.discute.show(new Tatami.Views.Statuses({
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
        initialize: function(){
            var self = this;

            _.defaults(this.options, {
                autoRefresh: true,
                cache: 0
            });
            this.initNext();
            this.initRefresh();

            this.listenTo(Tatami.app, 'refresh', function(){
                self.refresh();
            });
            this.listenTo(Tatami.app, 'next', function(){
                self.next();
            });
            this.listenTo(Tatami.app, 'dislay', this.onRender);
            this.listenTo(this.collection, 'add', function(model, collection, options){
                model.hidden = (options.at === 0);
            });
        },
        className: 'tatams',
        itemView: StatusItems,
        onBeforeItemAdded: function(itemView){
            if(!itemView.model.hidden)
                itemView.$el.slideDown();
        },
        appendHtml: function(collectionView, itemView, index){
            var element = collectionView.$el.children().get(index);
            if(element) $(element).before(itemView.$el);
            else collectionView.$el.append(itemView.el);
        },
        onRender: function(){
            this.children.each(function(view){
                view.model.hidden = false;
                view.$el.slideDown();
            });
        },
        initNext: function(){
            var self = this;
            this.next = _.once(function(cb){
                var options = {
                    remove:false,
                    merge:true,
                    success: function(){
                        self.initNext();
                        if (cb) cb();
                    }
                };
                if(self.collection.last())
                    options = _.extend(options, {
                        data: {
                            max_id: self.collection.last().id
                        }
                    });
                return self.collection.fetch(options);
            });
        },
        initRefresh: function(){
            var self = this;
            this.refresh = _.once(function(cb){
                var options = {
                    remove:false,
                    merge:true,
                    at:0,
                    success: function(){
                        Tatami.app.trigger('statusPending', self.collection.filter(function(model){
                            return model.hidden;
                        }).length);
                        self.initRefresh();
                        if (cb) cb();
                    }
                };
                if(self.collection.first())
                    options = _.extend(options, {
                        data: {
                            since_id: self.collection.first().id
                        }
                    });
                return self.collection.fetch(options);
            });
        }
    });

    Tatami.Views.Statuses = Statuses;
    Tatami.Views.StatusItems = StatusItems;
    Tatami.Views.StatusFooters = StatusFooters;
})(Backbone, _, Tatami);