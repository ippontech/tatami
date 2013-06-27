/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 27/06/13
 * Time: 15:37
 * To change this template use File | Settings | File Templates.
 */


var MUserGroup = Backbone.Model.extend({
    idAttribute : 'username',
    defaults : {
        avatar : '',
        firstName : '',
        lastName : '',
        role : ''
    },
    toJSON : function(){
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar : (this.get('avatar'))? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg': '/img/default_image_profile.png'
        });
    }
});