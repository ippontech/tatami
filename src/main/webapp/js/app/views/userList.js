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

    Tatami.Views.UserList = UserList;
    Tatami.Views.WhoToFollow = WhoToFollow;
})(Backbone, _, Tatami);