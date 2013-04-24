(function(Backbone, _, Tatami){

    var TagsBody = Backbone.Marionette.Layout.extend({
        template: '#TagsBody',
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        }
    });

    var TagsHeader = Backbone.Marionette.ItemView.extend({
        template: '#TagsHeader',
        modelEvents: {
            'change': 'render'
        },
        events: {
            'click .toggleTag': 'toggleTag'
        },
        toggleTag: function(){
            this.model.save({
              followed: !this.model.get('followed')
            }, {
              success: _.bind(this.render, this)
            });
        }
    });

    Tatami.Views.TagsBody = TagsBody;
    Tatami.Views.TagsHeader = TagsHeader;
})(Backbone, _, Tatami);