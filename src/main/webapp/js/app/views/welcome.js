var showWelcome = true;

(function(Backbone, _, Tatami){

    var WelcomeRegion = Backbone.Marionette.Layout.extend({
        template: '#Welcome',
        regions: {
            welcome: '.welcome'
        },
        events: {
            'click .launch-help': 'launchHelp',
            'click .hide-welcome': 'hideWelcome'
        },
        launchHelp: function() {
            this.hideWelcome();
            $('#WelcomeModal').modal('hide');
            $("#help-tour").click();
        },
        hideWelcome: function() {
            showWelcome = false;
        }
    });

    Tatami.Views.WelcomeRegion = WelcomeRegion;
})(Backbone, _, Tatami);
