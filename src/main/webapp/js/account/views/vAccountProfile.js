
var VAccountProfile = Marionette.ItemView.extend({
    initialize : function(){
         this.model.fetch();
    },
    tagName: 'form',
    template: '#account-profile',

    events: {
        'submit': 'saveForm'
    },

    modelEvents: {
        'sync': 'render'
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


