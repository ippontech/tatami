(function(Backbone, _, Tatami){
    var StatusShareItems = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: '#StatusShareItems',
        events: {
            'mouseover img': 'showUser',
            'mouseout img': 'hideUser',
            'click img': 'clickUser'
        },
        showUser: function() {
            this.$el.find("img").popover({
                animation: true,
                placement: 'top',
                trigger: 'manual',
                content: this.model.getFullName(),
            });
            this.$el.find("img").popover('show');
        },
        hideUser: function() {
            this.$el.find("img").popover('hide');
        },
        clickUser: function() {
            Backbone.history.navigate('users/' + this.model.id, true);
        }
    });

    var StatusShares = Backbone.Marionette.CompositeView.extend({
        itemView: StatusShareItems,
        template: "#StatusShares",
        serializeData: function () {
            return {
                sharesCount: this.collection.length
            };
        }
    });

    Tatami.Views.StatusShareItems = StatusShareItems;
    Tatami.Views.StatusShares = StatusShares;
})(Backbone, _, Tatami);