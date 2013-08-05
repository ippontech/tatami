
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
