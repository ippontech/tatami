(function(Backbone, _, Tatami){

    var SearchBody = Backbone.Marionette.Layout.extend({
        template: '#SearchBody',
        regions: {
            header: {
                selector: ".tatams-content-title"
            },
            tatams: {
                selector: ".tatams-container"
            }
        }
    });

    var SearchHeader = Backbone.Marionette.ItemView.extend({
        template: '#SearchHeader'
    });

    Tatami.Views.SearchHeader = SearchHeader;
    Tatami.Views.SearchBody = SearchBody;

})(Backbone, _, Tatami);