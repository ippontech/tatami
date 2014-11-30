
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

