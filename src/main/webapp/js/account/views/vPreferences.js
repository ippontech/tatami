
var VPreferences = Marionette.ItemView.extend({
    tagName: 'form',

    template: '#accountPreferences',
    initialize: function(){

        this.$el.addClass('form-horizontal row-fluid');
        this.model.fetch();
    },

    events: {
        'submit': 'submit'
    },

    modelEvents: {
        'sync' : 'render'
    },

    submit: function(e){
        e.preventDefault();
        var self = this;
        var form = $(e.target);

        self.model.set('mentionEmail', form.find('[name="mentionEmail"]')[0].checked);
        self.model.set('dailyDigest', form.find('[name="dailyDigest"]')[0].checked);
        self.model.set('weeklyDigest', form.find('[name="weeklyDigest"]')[0].checked);
        self.model.set('rssUidActive', form.find('[name="rssUidActive"]')[0].checked);


        self.model.save(null, {
            success: function(){
                app.trigger('even-alert-success',app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});