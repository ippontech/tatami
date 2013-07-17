/**
 * Created with IntelliJ IDEA.
 * User: Gregoire
 * Date: 26/06/13
 * Time: 14:50
 * To change this template use File | Settings | File Templates.
 */

//(function(Backbone, Tatami){


var MAccountProfile = Backbone.Model.extend({
    url: '/tatami/rest/account/profile',
    idAttribute: 'username',
    defaults : {
        username : window.username,
        firstName : '',
        lastName : '',
        jobTitle : '',
        phoneNumber : ''
    },
    toJSON : function(){
        return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
            avatar : (this.get('avatar'))? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg': '/img/default_image_profile.png'
        });
    }
});
//})(Backbone, Tatami);
