
(function(Backbone, _, Tatami){

    var HomeHeader = Backbone.Marionette.ItemView.extend({
        template: "#HomeHeader"
    });

    Tatami.Views.HomeHeader = HomeHeader;
})(Backbone, _, Tatami);