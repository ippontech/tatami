
var VPassword = Marionette.ItemView.extend({
    tagName: 'form',
    template: '#account-password',

    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');

        this.model.fetch();
    },

    modelEvents: {
        'error' : 'disable'
    },

    events: {
        'submit': 'submit',
        'change [name="newPassword"]' : 'validation',
        'change [name="newPasswordConfirmation"]' : 'validation'
    },

    disable: function(){
        this.$el.find('[name]').attr('disabled', 'disabled');
        this.$el.find('button[type="submit"]').attr('disabled', 'disabled');
        app.trigger('even-alert-error', app.formErrorLDAP);
    },

    validation: function(){
        var newPassword = this.$el.find('[name="newPassword"]');
        var newPasswordConfirmation = this.$el.find('[name="newPasswordConfirmation"]');
        if(newPassword.val() !== newPasswordConfirmation.val()){
            newPasswordConfirmation[0].setCustomValidity($('#account-password-newPasswordConfirmation').text());
            return;
        }
        newPasswordConfirmation[0].setCustomValidity('');
        return;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('oldPassword', form.find('[name="oldPassword"]').val());
        this.model.set('newPassword', form.find('[name="newPassword"]').val());
        this.model.set('newPasswordConfirmation', form.find('[name="newPasswordConfirmation"]').val());

        var self = this;
        self.model.save(null, {
            success: function(){
                $(e.target)[0].reset();
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});