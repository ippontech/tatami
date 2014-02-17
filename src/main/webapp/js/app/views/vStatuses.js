(function(Backbone, _, Tatami){
    var StatusItem = Backbone.Marionette.Layout.extend({

        initialize: function(){
            _.defaults(this.options, {
                discussion: true,
                isDelete: false
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

            preview: {
                selector: '#preview',
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
            'change:shared': 'onRender',
            'change:discussion': 'onRender'
        },
        events: {
            'mouseenter #current' : 'showAction',
            'mouseleave #current' : 'hideAction',
            'click #current': 'showDetails',
            'click #current a' : 'showLink',
            'click .status-action-show' : 'showDetails',
            'click .status-action-reply': 'replyAction',
            'click .status-action-reply a': '',
            'click .status-action-share': 'shareAction',
            'click .status-action-favorite': 'favoriteAction',
            'click .status-action-announce': 'announceAction',
            'click .status-action-announce-confirm': 'announceActionConfirm',
            'click .status-action-announce-cancel': 'announceActionCancel',
            'click .status-action-delete': 'deleteAction',
            'click .status-action-delete-confirm': 'deleteActionConfirm',
            'click .status-action-delete-cancel': 'deleteActionCancel'
        },
        onRender: function(){
            var current = this.$el.find('> #current');

            if(this.model.get('favorite') && (this.model.get('shared')|| this.model.get('shareByMe') ))
            {
                current.toggleClass('favorite', false);
                current.toggleClass('share', false);
                current.toggleClass('both', true);
            }
            else if(this.model.get('shareByMe') )
            {
                current.toggleClass('favorite', false);
                current.toggleClass('both', false);
                current.toggleClass('share', true);
            }
            else
            {
                current.toggleClass('both', false);
                current.toggleClass('favorite', this.model.get('favorite'));
                current.toggleClass('share', this.model.get('shared'));
            }

            this.$el.toggleClass('discussion', this.model.get('detailsAvailable'));
            this.attachments.show(new Tatami.Views.StatusAttachments({
                collection: new Backbone.Collection(this.model.get('attachments'))
            }));
            $(this.el).find("abbr.timeago").timeago();
            if(this.model.get('root')){
                this.$el.addClass('tatam-border-lr');
                if($(this.el).attr('class').indexOf('tatam-expand-container') == -1){
                    this.$el.addClass('tatam-hover');                    
                }                
            } else {
                this.$el.addClass('tatam-background');
            }
            this.$el.addClass('tatam-id-'+this.model.id);

            if ( !this.model.get('activated') ) {
                this.$el.addClass("desactivated");
            }
            else {
                this.$el.removeClass("desactivated");
            }
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
            self.model.save({
                shared: !self.model.get('shared')
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
                    }, 500);

                }
            });
            return false;
        },

        showLink: function(e){
            var target = e.target.target;
            var href = e.target.href;
            if(target == ''){
                var exp = /.*(#.*)/;
                href = href.replace(exp, '$1');
                Backbone.history.navigate(href, true);    
            } else {
                window.open(href,'_blank');
            }

            return false;
        },
        /*--------------------------------------------------------*/
        showAction :function(){
            currentModel = this.model;
            if (this.model.get('type') != 'STATUS' && this.model.get('type') != 'SHARE' && this.model.get('type') != 'ANNOUNCEMENT') {
                return;
            }

            if(!this.buttons.currentView){
                var self = this;

                        self.buttons.show(new StatusFooters({model: currentModel}));
                        //self.buttons.$el.toggle({duration: 200});
                        self.buttons.$el.css('display' , 'block')  ;
                        self.buttons.$el.css('visibility' , 'visible')  ;

            }
            return false;
        },

        hideAction :function(){
            currentModel = this.model;
            if (this.model.get('type') != 'STATUS' && this.model.get('type') != 'SHARE' && this.model.get('type') != 'ANNOUNCEMENT') {
                return;
            }
            var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
            statusDetail.set("groupId", this.model.get("groupId"));
            statusDetail.set("statusPrivate", this.model.get("statusPrivate"));
            statusDetail.set("type", this.model.get("type"));
            //this.buttons.$el.toggle({duration: 200});
            this.buttons.$el.css('visibility' , 'hidden')  ;

            this.buttons.currentView = null;



            return false;
        },

        /*----------------------------------------------------------------------------------------*/
        showDetails: function(){
            currentModel = this.model;

            if (this.model.get('type') != 'STATUS' && this.model.get('type') != 'SHARE' && this.model.get('type') != 'ANNOUNCEMENT') {
                return;
            }
            var isRoot = this.model.get('root');
                var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
                statusDetail.set("groupId", this.model.get("groupId"));
                statusDetail.set("statusPrivate", this.model.get("statusPrivate"));
                statusDetail.set("type", this.model.get("type"));
                if(!this.share.$el){
                    var self = this;
                    statusDetail.set('refDate', this.model.get('statusDate'));
                    statusDetail.fetch({
                        success: function(){                
                            var shares = statusDetail.get('sharedByLogins');
                            self.shares = {};
                            self.share.show(new Tatami.Views.StatusShares({
                                collection: new Tatami.Collections.Users(shares)
                            }));
                            if(shares.length){
                                self.share.$el.slideToggle({duration: 100});
                            }
                            self.buttons.$el.css('visibility' , 'visible')  ;

                            //TODO CodingParty : Afficher l'annulation du partage
                            currentModel.set('sharedByMe', statusDetail.isSharedBy(Tatami.app.user.get('username')));

                            if (self.model.getImages() != null && self.model.getImages().length > 0) {

                                self.preview.show(new Tatami.Views.StatusImagePreview({
                                    model: self.model
                                }));

                                setTimeout(function() {
                                    self.preview.$el.slideToggle({duration: 100});
                                }, 500);  
                            }

                            if(isRoot){
                                $(self.el).animate({marginTop: '+=0', marginBottom: '+=0'}, 100);
                                $(self.el).toggleClass('tatam-hover');
                                $(self.el).toggleClass('tatam-expand-container').animate(100);
                                var befores = statusDetail.getStatusBefore();
                                var before = new Tatami.Views.Statuses({
                                    collection: befores,
                                    itemViewOptions: {
                                        discussion: false
                                    },
                                    autoRefresh: false                        
                                });   
                                self.before.show(before);   


                                if(befores.length > 0){
                                    setTimeout(function() {
                                        self.before.$el.slideToggle({duration: 100});
                                    }, 500);
                                }   

                                var afters = statusDetail.getStatusAfter();
                                var after = new Tatami.Views.Statuses({
                                    collection: afters,
                                    itemViewOptions: {
                                        discussion: false
                                    },
                                    autoRefresh: false                        
                                });

                                self.after.show(after);
                                setTimeout(function() {
                                    if(afters.length > 0){
                                        self.after.$el.slideToggle({duration: 100});
                                    }
                                }, 500);   
                            }                         
                        }

                    });
                } else {
                    var shares = statusDetail.get('sharedByLogins');
                    if(shares.length){
                        this.share.$el.slideToggle({duration: 100});
                    }
                    if(this.model.getImages() != null && this.model.getImages().length > 0){
                        this.preview.$el.slideToggle({duration: 100});
                    }
                    if(isRoot){
                        if($(this.el).attr('class').indexOf('tatam-expand-container') != -1){
                            $(this.el).animate({marginTop: '-=0', marginBottom: '-=0'}, 100);
                        } else {
                            $(this.el).animate({marginTop: '+=0', marginBottom: '+=0'}, 100);
                        }
                        if(this.before.$el) this.before.$el.slideToggle({duration: 100});
                        if(this.after.$el) this.after.$el.slideToggle({duration: 100});
                        $(this.el).toggleClass('tatam-hover');
                        $(this.el).toggleClass('tatam-expand-container');
                    }
                    this.buttons.currentView = null;
                }
            return false;        
        },
        refreshDetails: function(){
            var statusDetail = Tatami.Factories.Status.getStatusDetail(this.model.id);
            var self = this;
            statusDetail.fetch({
                success: function(){
                    var shares = statusDetail.get('sharedByLogins');
                    self.share.show(new Tatami.Views.StatusShares({
                        collection: new Tatami.Collections.Users(shares)
                    }));
                    if(shares.length){
                        self.share.$el.slideToggle({duration: 200});
                        self.$el.find('.status-action-share').hide();
                    }
                }
            });
        },
        replyAction: function(){
            Tatami.app.trigger('edit:show',{
                    status: this.model.id
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
            var self = this;
            this.$el.find('.status-action-delete').popover('hide');
            this.options.isDelete = true;            
            this.$el.hide('slow', function(){
                self.model.destroy();
            });

            var statusToDelete = $(".tatam-id-"+this.model.id);
            statusToDelete.each(function(status){
                statusToDelete.hide(function(){
                    this.remove();
                }).slideDown();
            }); 

            return false;
        },
        deleteActionCancel: function(){
            this.$el.find('.status-action-delete').popover('hide');
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
        tagName: 'span'
    });

    var StatusAttachments = Backbone.Marionette.CollectionView.extend({
        itemView: StatusAttachmentItems
    });

    var StatusActions = Backbone.Marionette.ItemView.extend({
        template: '#StatusActions'
    });

    var StatusImageSlider = Backbone.Marionette.Layout.extend({
        template: '#ImageSlider',
        initialize: function(){
            _.defaults(this.options, {                
                currentIndex: 0
            });
        },
        events: {
            'click .slider-button-left': 'left',
            'click .slider-button-right': 'right'
        },
        left: function(event){
            var index = this.options.currentIndex;
            var images = this.model.getImages();
            index--;
            if(index < 0){
                index = images.length-1;
            }
            this.$el.find('img').attr('src', '/tatami/file/'+images[index].attachmentId+'/'+images[index].filename);
            this.options.currentIndex = index;
        },
        right: function(event){
            var index = this.options.currentIndex;
            var images = this.model.getImages();
            index++;
            if(index >= images.length){
                index = 0;
            }
            this.$el.find('img').attr('src', '/tatami/file/'+images[index].attachmentId+'/'+images[index].filename);
            this.options.currentIndex = index;
        }

    });

    var StatusImagePreview = Backbone.Marionette.Layout.extend({
        template: '#ImagePreview',
        className: 'image-preview-template', 
        initialize: function(){
            _.defaults(this.options, {                
                currentIndex: 0
            });
        },
        events: {            
            'click .slide-img': 'showImage',
            'click a': 'showLink'
        }, 
        showImage: function(event){
            var className = event.target.className;
            var current = className.replace(/.*slide-img-n(.*)/, '$1');
            var self = this;
            self.model.set('current', current);
            var slider = new StatusImageSlider({
                model: self.model,
                currentIndex: current
            });
            Tatami.app.slider.show(slider);
            Tatami.app.slider.$el.modal('show');
            return false;
        },
        showLink: function(event){
            var href = event.target.src;
            window.open(href,'_blank');
            return false;
        }

    });


    Tatami.Views.Statuses = Statuses;
    Tatami.Views.StatusItem = StatusItem;
    Tatami.Views.StatusActions = StatusActions;
    Tatami.Views.StatusAttachments = StatusAttachments;
    Tatami.Views.StatusAttachmentItems = StatusAttachmentItems;
    Tatami.Views.StatusImagePreview = StatusImagePreview;
    Tatami.Views.StatusImageSlider = StatusImageSlider;
})(Backbone, _, Tatami);