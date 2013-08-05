(function(Backbone, _, Tatami){
    var UserItems = Backbone.Marionette.ItemView.extend({
        className: 'useritem',
        template: '#UserItems',
        modelEvents: {
            'change': 'render'
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

    var UserList = Backbone.Marionette.CollectionView.extend({
        itemView: UserItems,
        itemViewContainer: '.items'
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