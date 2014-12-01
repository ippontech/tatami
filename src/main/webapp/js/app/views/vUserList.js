(function(Backbone, _, Tatami){
    var UserItems = Backbone.Marionette.ItemView.extend({
        className: 'useritem',
        template: '#UserItems',
        modelEvents: {
            'change': 'render'
        },
        events: {
            'click .toggleFriend': 'toggleFriend',
            'click .desactivateUser': 'desactivateUser'
        },
        serializeData: function(){
            var res = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);
            res.desactivable = this.options.desactivable;
            return res;
        },
        onRender : function (){
            if ( !this.model.get("activated") ) {
                this.$el.addClass("desactivated");
            }
            else {
                this.$el.removeClass("desactivated");
            }
        },
        toggleFriend: function(){
            this.model.save(
            {
                friendShip: true,
                friend: !this.model.get("friend")
            },
            {
                patch: true
            });
        },
        desactivateUser: function() {
            this.model.save(
                {
                    activate: true
                },
                {
                    patch: true
                }
            );
        }
    });

    var UserList = Backbone.Marionette.CollectionView.extend({
        itemView: UserItems,
        itemViewContainer: '.items',
        itemViewOptions:{desactivable:false}
    });

    var UserItemsMini = UserItems.extend({
        className: 'useritemmini',
        template: '#UserItemsMini',
        modelEvents: {
            'change': 'render'
        },
        events: {
            'click .toggleFriend': 'toggleFriend'
        }
    });

    var WhoToFollow = Backbone.Marionette.CompositeView.extend({
        itemView: UserItemsMini,
        itemViewContainer: '.items',
        template: '#WhoToFollow'
    });

    var UserGroupItems =  Backbone.Marionette.ItemView.extend({

        template: '#usergroup-item',
        tagName : 'tr',

        modelEvents: {
            'change': 'render',
            'sync': 'render'

        },
        events: {
            'click .delete' : 'removeUser'
        },
        onRender : function (){
            if ( !this.model.get("activated") ) {
                this.$el.addClass("desactivated");
            }
            else {
                this.$el.removeClass("desactivated");
            }
        },
        removeUser : function(){

            this.model.destroy();

        }

    });

    var UserGroupList = Backbone.Marionette.CompositeView.extend({
        itemView: UserGroupItems,
        itemViewContainer: '.items',
        template: '#UserGroupList',
        className: 'useritem'
    });

    Tatami.Views.UserList = UserList;
    Tatami.Views.WhoToFollow = WhoToFollow;
    Tatami.Views.UserGroupList = UserGroupList;
})(Backbone, _, Tatami);