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
            'click .toggleTag': 'toggleTag',
            'click .tagsHome': 'tagsHome'
        },
        toggleTag: function(){
            this.model.save({
              followed: !this.model.get('followed')
            }, {
              success: _.bind(this.render, this)
            });
        },
        tagsHome: function(){
            Tatami.app.router.navigate("timeline", { trigger: true });
        }
    });

    Tatami.Views.TagsBody = TagsBody;
    Tatami.Views.TagsHeader = TagsHeader;
})(Backbone, _, Tatami);