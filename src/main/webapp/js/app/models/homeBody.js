(function(Backbone, Tatami){

    var HomeBody = Backbone.Model.extend({
        idAttribute: 'tabName',

        defaults: {
            tabName: 'timeline'
        }

    });

    Tatami.Models.HomeBody = HomeBody;


})(Backbone, Tatami);