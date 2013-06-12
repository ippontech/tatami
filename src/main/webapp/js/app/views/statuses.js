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
            before: {
                selector: '#before',
                regionType: Marionette.Region.extend({
                    open: function(view){
                        this.$el.css('display', 'none');
                        this.$el.html(view.el);
                    }
                })
            },
            after: {
                selector: '#after',
                regionType: Marionette.Region.extend({
                    open: function(view){
                        this.$el.css('display', 'none');
                        this.$el.html(view.el);
                    }
                })
            },

            share: {
                selector: '#share',
                regionType: Marionette.Region.extend({
                    open: function(view){
                        this.$el.css('display', 'none');
                        this.$el.html(view.el);
                    }
                })
            },

            buttons: {
                selector: '#buttons',
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
            'click': 'showDetails',
            'click .status-action-show' : 'showDetails',
            'click .status-action-reply': 'replyAction',
            'click .status-action-share': 'shareAction',
            'click .status-action-favorite': 'favoriteAction',
            'click .status-action-announce': 'announceAction',
            'click .status-action-announce-confirm': 'announceActionConfirm',
            'click .status-action-announce-cancel': 'announceActionCancel',
            'click .status-action-delete': 'deleteAction',
            'click .status-action-delete-confirm': 'deleteActionConfirm',
            'click .status-action-delete-cancel': 'deleteActionCancel',
            'click .status-action-attach': 'showAttach'
        },
        onRender: function(){
            console.log("rendrer");
            this.$el.toggleClass('favorite', this.model.get('favorite'));
            this.$el.toggleClass('discussion', this.model.get('detailsAvailable'));
            this.attachments.show(new Tatami.Views.StatusAttachments({
                collection: new Backbone.Collection(this.model.get('attachments'))
            }));
            $(this.el).find("abbr.timeago").timeago();
            if(this.model.get('root')){
                this.$el.addClass('tatam-border-lr tatam-hover');    
            } else {
                this.$el.addClass('tatam-background');
            }
        },
        showDetails: function(){
            currentModel = this.model;
            if (this.model.get('type') != 'STATUS' && this.model.get('type') != 'SHARE' && this.model.get('type') != 'ANNOUNCEMENT') {
                return;
            }
            if(this.model.get('root')){
                var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
                statusDetail.set("groupId", this.model.get("groupId"));
                statusDetail.set("statusPrivate", this.model.get("statusPrivate"));
                statusDetail.set("type", this.model.get("type"));
                if(!this.before.currentView){
                    var self = this;
                    statusDetail.set('refDate', this.model.get('statusDate'));
                    statusDetail.fetch({
                        success: function(){                
                            $(self.el).animate({marginTop: '+=10', marginBottom: '+=10'}, 200);

                            var shares = statusDetail.get('sharedByLogins');
                            self.share.show(new Tatami.Views.StatusShares({
                                collection: new Tatami.Collections.Users(shares)
                            }));
                            if(shares.length){
                                self.share.$el.slideToggle({duration: 200});
                            }

                            self.buttons.show(new StatusFooters({model: currentModel}));
                            self.buttons.$el.slideToggle({duration: 200});

                            var before = new Tatami.Views.Statuses({
                                collection: new Tatami.Collections.Statuses(statusDetail.getStatusBefore()),
                                itemViewOptions: {
                                    discussion: false
                                },
                                autoRefresh: false                        
                            });

                            self.before.show(before);   
                            if(statusDetail.getStatusBefore().length > 0){
                                setTimeout(function() {
                                    self.before.$el.slideToggle({duration: 100});
                                }, 500);
                            }
                            


                            var after = new Tatami.Views.Statuses({
                                collection: new Tatami.Collections.Statuses(statusDetail.getStatusAfter()),
                                itemViewOptions: {
                                    discussion: false
                                },
                                autoRefresh: false                        
                            });

                            self.after.show(after);
                            setTimeout(function() {
                                if(statusDetail.getStatusAfter().length > 0){
                                    self.after.$el.slideToggle({duration: 100});
                                }
                            }, 500);                            

                            $(self.el).toggleClass('tatam-hover');
                            $(self.el).toggleClass('tatam-expand-container').animate(200);
                        }

                    });
                } else {
                    this.before.$el.slideToggle({duration: 200});
                    this.after.$el.slideToggle({duration: 200});
                    this.buttons.$el.slideToggle({duration: 200});
                    var shares = statusDetail.get('sharedByLogins');
                    if(shares.length){
                        this.share.$el.slideToggle({duration: 200});
                    }
                    if($(this.el).attr('class').indexOf('tatam-expand-container') == -1){
                        $(this.el).animate({marginTop: '+=10', marginBottom: '+=10'}, 200);
                    } else {
                        $(this.el).animate({marginTop: '-=10', marginBottom: '-=10'}, 200);
                    }
                    $(this.el).toggleClass('tatam-hover');
                    $(this.el).toggleClass('tatam-expand-container');
                    this.before.currentView = null;
                }
                // return false;
            }            
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
            this.model.save(
                {favorite: !self.model.get('favorite')}, 
                {patch: true}
            );
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
        announceAction: function() {
            var self = this;
            var popoverNode = self.$el.find('.status-action-announce');
            popoverNode.popover({
                html: true,
                animation: true,
                placement: 'top',
                trigger: 'manual',
                content: self.$el.find('.status-action-announce').attr('confirmation-text')
            });
            popoverNode.popover('show');
            return false;
        },
        announceActionConfirm: function(){
            this.$el.find('.status-action-announce').popover('hide');
            var self = this;
            this.model.save({
                announced: true
            }, {
                patch: true,
                success: function(){
                    self.onRender();
                }
            });
            return false;
        },
        announceActionCancel: function(){
            this.$el.find('.status-action-announce').popover('hide');
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
            return false;
        },
        remove: function(){
            this.$el.hide(function(){
                $(this).remove();
            }).slideDown(); 
        }, 
        showAttach: function(e){
            window.open(e.target.attr("href"),'_blank');
            return false;
        }
    });

    var StatusFooters = Backbone.Marionette.Layout.extend({
        template: "#StatusFooters"

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

            if(itemView.model.get('first')){
                itemView.$el.addClass('tatam-first');
            }
            if(itemView.model.get('last')){
                itemView.$el.addClass('tatam-last');
            }

            if(element){
                $(element).before(itemView.$el);
            } else {
                collectionView.$el.append(itemView.el);  
            } 
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
    // Tatami.Views.StatusFooters = StatusFooters;
    Tatami.Views.StatusAttachments = StatusAttachments;
    Tatami.Views.StatusAttachmentItems = StatusAttachmentItems;
})(Backbone, _, Tatami);