(function(Backbone, _, Tatami){
    var GroupItems = Backbone.Marionette.ItemView.extend({
        template: '#GroupItems'
    });

    var Groups = Backbone.Marionette.CompositeView.extend({
        itemView: GroupItems,
        itemViewContainer: '.items',
        template: '#Groups'
    });

    Tatami.Views.GroupItems = GroupItems;
    Tatami.Views.Groups = Groups;
})(Backbone, _, Tatami);