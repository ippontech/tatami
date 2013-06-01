(function(Backbone, _, Tatami){
    var StatusItem = Backbone.Marionette.Layout.extend({
        initialize: function(){
            _.defaults(this.options, {
                discussion: true
            });
        },
        updateDetailModel: function(model, id){
            this.options.details.set('statusId', id);
        },
        className: 'tatam pointer',
        template: '#StatusItem',
        regions: {
            statusActions: '.statusActions',
            footer: {
                selector: 'footer',
                regionType: Marionette.Region.extend({
                    open: function(view){
                        this.$el.css('display', 'none');
                        this.$el.html(view.el);
                    }
                })
            },
            attachments: '.attachments'
        },
        modelEvents: {
            'change:statusId': 'updateDetailModel',
            'change:favorite': 'onRender',
            'change:discussion': 'onRender'
        },
        events: {
            'click > div': 'showDetails',
            'click .status-action-reply': 'replyAction',
            'click .status-action-share': 'shareAction',
            'click .status-action-favorite': 'favoriteAction',
            'click .status-action-delete': 'deleteAction',
            'click .status-action-delete-confirm': 'deleteActionConfirm',
            'click .status-action-delete-cancel': 'deleteActionCancel'
        },
        onRender: function(){
            this.$el.toggleClass('favorite', this.model.get('favorite'));
            this.$el.toggleClass('discussion', this.model.get('detailsAvailable'));
            this.attachments.show(new Tatami.Views.StatusAttachments({
                collection: new Backbone.Collection(this.model.get('attachments'))
            }));
            $(this.el).find("abbr.timeago").timeago();
        },
        showDetails: function(){
             var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
             if(!this.footer.currentView){
                this.footer.show(new StatusFooters({
                    model: statusDetail,
                    username: this.model.get('username'),
                    discussion: this.options.discussion
                }));
                statusDetail.fetch();
            }
            this.footer.$el.fadeToggle({duration: 100});
        },
        refreshDetails: function(){
            var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
            statusDetail.fetch();
        },
        replyAction: function(){
            Tatami.app.trigger('edit:show',{
                    status: this.model.id
            });
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
                    var popoverNode = self.$el.find('.status-action-share');
                    popoverNode.popover({
                            animation: true,
                            placement: 'top',
                            trigger: 'manual',
                            content: self.$el.find('.status-action-share').attr('success-text')
                        });
                    popoverNode.popover('show');
                    setTimeout(function() {
                        popoverNode.popover('hide');
                        self.refreshDetails();
                    }, 1000);
                }
            });
            return false;
        },
        deleteAction: function(){
            var self = this;
            var popoverNode = self.$el.find('.status-action-delete');
            popoverNode.popover({
                html: true,
                animation: true,
                placement: 'top',
                trigger: 'manual',
                content: self.$el.find('.status-action-delete').attr('confirmation-text')
            });
            popoverNode.popover('show');
            return false;
        },
        deleteActionConfirm: function(){
            this.$el.find('.status-action-delete').popover('hide');
            this.model.destroy();
            return false;
        },
        deleteActionCancel: function(){
            this.$el.find('.status-action-delete').popover('hide');
        }
    });

    var StatusFooters = Backbone.Marionette.Layout.extend({
        initialize: function(){
            _.defaults(this.options, {
                discussion: true,
                slide: true
            });

            this.$el.css('display', 'none');

            var self = this;
            this.slideDown = _.debounce(function(){
                self.$el.slideDown({duration: 100});
            });
        },
        template: "#StatusFooters",

        regions: {
            share: ".tatams-share",
            discussion: ".tatams-discussion"
        },

        modelEvents: {
            'sync': 'onRender'
        },
        serializeData: function(){
            return _.extend(this.model.toJSON(), this.options);
        },

        onRender: function(){
            var shares = this.model.get('sharedByLogins');
            if(shares && shares.length > 0){
                if (this.share.currentView) {
                    this.share.currentView.collection.set(shares, {
                        remove: false
                    });
                } else {
                    var currentUsername = Tatami.app.user.get('username');
                    for (var i = 0; i < shares.length; i++) {
                        if (shares[i].username == currentUsername) {
                            this.$el.find('.status-action-share').hide();
                        }
                    }
                    this.share.show(new Tatami.Views.StatusShares({
                        collection: new Tatami.Collections.Users(shares)
                    }));
                }
            }

            var discussion = this.model.get('discussionStatuses');
            if(this.options.discussion && discussion && discussion.length > 0){
                if(this.discussion.currentView) {
                    this.discussion.currentView.collection.set(discussion, {
                        remove: false
                    });
                } else {
                    var replies = new Tatami.Views.Statuses({
                        collection: new Tatami.Collections.Statuses(discussion),
                        itemViewOptions: {
                            discussion: false
                        },
                        autoRefresh: false
                    });
                    this.discussion.show(replies);
                }
            }
            this.slideDown({duration: 100});
        }
    });

    var Statuses = Backbone.Marionette.CollectionView.extend({
        initialize: function(){
            var self = this;

            _.defaults(this.options, {
                autoRefresh: true
            });

            if(this.options.autoRefresh){
                this.listenTo(Tatami.app, 'refresh', function(options){
                    options = options ? _.clone(options) : {};
                    _.defaults(options || {}, {
                        display: false
                    });
                    self.collection.refresh(function(){
                        if(options.display) {
                            Tatami.app.trigger('display');
                            Tatami.app.trigger('statusPending');
                        }
                    });
                });
                    this.listenTo(Tatami.app, 'next', function(){
                    self.collection.next();
                });
                this.listenTo(Tatami.app, 'display', this.onRender);
            }

            this.listenTo(this.collection, 'add', function(model, collection, options){
                model.hidden = (options.at === 0);
            });
        },
        className: 'tatams',
        itemView: StatusItem,
        onBeforeItemAdded: function(itemView){
            if(!itemView.model.hidden)
                itemView.$el.show();
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
        }
    });

    var StatusAttachmentItems = Backbone.Marionette.ItemView.extend({
        template: '#StatusAttachmentItems',
        tagName: 'div'
    });

    var StatusAttachments = Backbone.Marionette.CollectionView.extend({
        itemView: StatusAttachmentItems
    });

    var StatusActions = Backbone.Marionette.ItemView.extend({
        template: '#StatusActions'
    });

    Tatami.Views.Statuses = Statuses;
    Tatami.Views.StatusItem = StatusItem;
    Tatami.Views.StatusActions = StatusActions;
    Tatami.Views.StatusFooters = StatusFooters;
    Tatami.Views.StatusAttachments = StatusAttachments;
    Tatami.Views.StatusAttachmentItems = StatusAttachmentItems;
})(Backbone, _, Tatami);