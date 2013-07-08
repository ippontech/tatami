/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 17:07
 * To change this template use File | Settings | File Templates.
 */

var VPreferences = Marionette.ItemView.extend({
    tagName: 'form',
    //template: _.template($('#account-preferences').html()),
    template: '#account-preferences',
    initialize: function(){
        this.$el.addClass('form-horizontal row-fluid');
        this.model = new MPreferences();
        this.model.fetch({
            //success:_.bind(this.render, this)
        });
    },

    events: {
        'submit': 'submit'
    },

    /*render: function(){
        this.$el.empty();
        this.$el.html(this.template({
            preferences: this.model.toJSON()
        }));
        this.delegateEvents();
        return this.$el;
    },  */

    submit: function(e){
        e.preventDefault();

        var form = $(e.target);

        this.model.set('mentionEmail', form.find('[name="mentionEmail"]')[0].checked);
        this.model.set('dailyDigest', form.find('[name="dailyDigest"]')[0].checked);
        this.model.set('weeklyDigest', form.find('[name="weeklyDigest"]')[0].checked);
        this.model.set('rssUidActive', form.find('[name="rssUidActive"]')[0].checked);

        var self = this;
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