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
                self.$(".return").html(new VFormSuccess().render().$el);

                //Tatami.app.trigger('success', 'Profil sauvegardé');

                /*this.listenTo(Tatami.app, 'success', function(msg){

                });*/
                //self.render();  //Only with region ?
            },
            error: function(){
                self.$(".return").html(new VFormError().render().$el);
                //self.render();   // Only with region?
            }
        });
    }
});

var VFormSuccess = Marionette.ItemView.extend({
   // tag: '.return', ok with region ?
    template: "#form-success"
} );

var VFormError = Marionette.ItemView.extend({
    tag: '.return',
    template: "#form-error"
} );

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
                //self.$el.find('.return').append($('#form-success').html());
                self.$(".return").html(new VFormSuccess().render().$el);
                _.delay(_.bind(window.location.reload, window), 5000);
            },
            error: function(){
                //self.$el.find('.return').append($('#form-error').html());
                self.$(".return").html(new VFormSuccess().render().$el);
            }
        });
    }
});


