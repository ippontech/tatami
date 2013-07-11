(function(Backbone, _, Tatami, Modernizr, window){

    var User = Backbone.Model.extend({
        initialize: function(){
          this.listenTo(this, 'sync', function(model){
            if(Tatami.app.user.id === model.id)
              Tatami.app.user.set(model.toJSON());
          });
        },

        idAttribute: 'username',

        defaults: {
            login: '',
            avatar: '',
            firstName: '',
            lastName: '',
            jobTitle: '',
            phoneNumber: '',
            viadeo: '',
            linkedIn: '',
            skype: '',
            twitter: '',
            facebook: '',
            googlePlus: '',
            hireDate: '',
            attachementsSize: 0,
            friendsCount: 0,
            followersCount: 0,
            statusCount: 0,
            you: false,
            friend: false,
            follower: false
        },

        urlRoot: '/tatami/rest/users/',

        toJSON: function(){
            var attr = Backbone.Model.prototype.toJSON.call(this);
            attr.fullName = this.getFullName();
            attr.avatarURL = this.getAvatarURL();
            attr.facebookURL = this.getFacebookURL();
            attr.viadeoURL = this.getViadeoURL();
            attr.linkedInURL = this.getLinkedInURL();
            attr.twitterURL = this.getTwitterURL();
            attr.googlePlusURL = this.getGooglePlusURL();
            attr.skypeURL = this.getSkypeURL();
            return attr;
        },

        getFullName: function(){
            var fullName = [];

            if (this.get('firstName')) fullName.push(this.get('firstName'));
            if (this.get('lastName')) fullName.push(this.get('lastName'));

            return fullName.join(' ');
        },

        getAvatarURL: function(){
            return (this.get('avatar'))? '/tatami/avatar/' + this.get('avatar') + '/photo.jpg': '/img/default_image_profile.png';
        },

        getViadeoURL: function(){
            return (this.get('viadeo'))? 'http://www.viadeo.com/' + this.get('viadeo') : '';
        },

        getLinkedInURL: function(){
            return (this.get('linkedIn'))? 'http://www.linkedin.com/' + this.get('linkedIn') : '';
        },

        getFacebookURL: function(){
            return (this.get('facebook'))? 'https://www.facebook.com/' + this.get('facebook') : '';
        },

        getTwitterURL: function(){
            return (this.get('twitter'))? 'https://twitter.com/' + this.get('twitter') : '';
        },

        getGooglePlusURL: function(){
            return (this.get('googlePlus'))? 'https://plus.google.com/' + this.get('googlePlus') : '';
        },

        getSkypeURL: function(){
            return (this.get('skype'))? 'http://www.skype.com/' + this.get('skype') : '';
        },

        toggleIsFriend: function(options){
            this.fetch({
                friend: !this.model.get('friend')
            }, options || null);
        }
    });

    Tatami.Models.User = User;

})(Backbone, _, Tatami, Modernizr, window);