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

    var TagsAdmin = Backbone.Marionette.ItemView.extend({
        template: '#tags-item',
        tagName: 'tr',

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

    var TagsList  = Backbone.Marionette.CompositeView.extend({
        itemView: TagsAdmin,
        itemViewContainer: '.items',
        template :'#TagsListTemplate'
    });

    Tatami.Views.TagsBody = TagsBody;
    Tatami.Views.TagsHeader = TagsHeader;
    Tatami.Views.TagsList = TagsList;

})(Backbone, _, Tatami);