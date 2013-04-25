(function(Backbone, _, Tatami){

    Tatami.Factories.Profile = {
        profileSide: function(){
            return new Tatami.Views.ProfileSide();
        },
        profileBody: function(){
            return new Tatami.Views.ProfileBody();
        },
        profileHeader: function(){
            return new Tatami.Views.ProfileHeader();
        },
        profile: function(username){
            var user = new Tatami.Models.Users({
                username: username
            });

            user.fetch();
            return user;
        }
    };

})(Backbone, _, Tatami);