(function(Backbone, _, Tatami){

    var TagsBody = Backbone.Marionette.Layout.extend({
        template: '#TagsBody',
        regions: {
            header: {
                selector: ".tatams-content-title"
            },
            tatams: {
                selector: ".tatams-container"
            }
        }
        // events: {
        //     'click .toggleTag': 'toggleTag'
        // },
        // modelEvents: {
        //     'change': 'render'
        // },
        // toggleTag: function(){
        //     this.model.save({
        //       followed: !this.model.get('followed')
        //     });
        // }
    });

    var TagsHeader = Backbone.Marionette.ItemView.extend({
        template: '#TagsHeader',
        modelEvents: {
            'change': 'render'
        },
        events: {
            'click .toggleTag': 'toggleTag'
        },
        modelEvents: {
            'change': 'render'
        },
        toggleTag: function(){
            this.model.save({followed: !this.model.get('followed')});
        }
    });

    Tatami.Views.TagsBody = TagsBody;
    Tatami.Views.TagsHeader = TagsHeader;
})(Backbone, _, Tatami);