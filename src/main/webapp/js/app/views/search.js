(function(Backbone, _, Tatami){

    var SearchBody = Backbone.Marionette.Layout.extend({
        template: '#SearchBody',
        className: 'searchbody',
        regions: {
            tatams: {
                selector: ".tatams-container"
            }
        }
    });

    Tatami.Views.SearchBody = SearchBody;

})(Backbone, _, Tatami);