/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 15:03
 * To change this template use File | Settings | File Templates.
 */


var VTag = Marionette.ItemView.extend({
    initialize: function(){
        this.model.bind('change', this.render, this);

    },

    template:_.template($('#tags-item').html()),
    tagName: 'tr',

    events:{
        'click': 'show',
        'click .follow': 'follow'
    },

    follow: function(){
        var self = this;
        var m;
        if(this.model.get('followed')){
            m = new MUnFollowTag(this.model.toJSON());
        }
        else {
            m = new MFollowTag(this.model.toJSON());
        }
        m.save(null, {
            success : function(){
                self.model.set('followed', !self.model.get('followed'));
                self.render();
            }
        });
    },

    show: function(){

    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this.$el;
    }
});