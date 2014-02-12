
var VPassword = Marionette.ItemView.extend({
    tagName: 'form',
    template: '#accountPassword',

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
        if (login.indexOf("&#64;ippon&#46;fr") != -1){
            this.$el.find('[name]').attr('disabled', 'disabled');
            this.$el.find('button[type="submit"]').attr('disabled', 'disabled');
            app.trigger('even-alert-error', app.formErrorLDAP);
        }
    },

    validation: function(){
        if (!ie || ie > 9){
            var newPassword = this.$el.find('[name="newPassword"]');
            var newPasswordConfirmation = this.$el.find('[name="newPasswordConfirmation"]');
            if(newPassword.val() !== newPasswordConfirmation.val()){
                newPasswordConfirmation[0].setCustomValidity($('#accountNewPasswordConfirmation').text());
                return;
            }
            newPasswordConfirmation[0].setCustomValidity('');
        }
        return;
    },

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('oldPassword', form.find('[name="oldPassword"]').val());
        this.model.set('newPassword', form.find('[name="newPassword"]').val());
        this.model.set('newPasswordConfirmation', form.find('[name="newPasswordConfirmation"]').val());

        if (ie && ie<10){
            var newPassword = this.$el.find('[name="newPassword"]');
            var newPasswordConfirmation = this.$el.find('[name="newPasswordConfirmation"]');
        }

        var self = this;
        self.model.save(null, {
            success: function(){
                $(e.target)[0].reset();
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
                if (ie && ie<10){
                    if(newPassword.val() !== newPasswordConfirmation.val()){
                        app.trigger('even-alert-warning', $('#accountNewPasswordConfirmation').html());
                    }
                }
            }
        });
    }
});