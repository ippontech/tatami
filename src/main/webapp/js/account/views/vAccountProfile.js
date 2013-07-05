/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:50
 * To change this template use File | Settings | File Templates.
 */


var VAccountProfile = Marionette.ItemView.extend({
    tagName: 'form',
    template: '#account-profile',

    events: {
        'submit': 'saveForm'
    },

    saveForm: function(e){
        e.preventDefault();
        var self = this;

        _.each($(e.target).serializeArray(), function(value){
            self.model.set(value.name, value.value);
        });

        self.model.save(null, {
            success: function(){
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                //self.$(".return").html(new VFormError().render().$el);
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});

var VAccountProfileDestroy = Marionette.ItemView.extend({
    tagName: 'form',
    template: '#account-destroy',

    events: {
        'submit': 'destroy'
    },

    destroy: function(e){
        e.preventDefault();
        var self = this;

        debugger;
        self.model.destroy({
            success: function(){
                app.trigger('even-alert-success', app.formSuccess);
            },
            error: function(){
                app.trigger('even-alert-error', app.formError);
            }
        });
    }
});


