(function(Backbone, _, Tatami){

    Tatami.Factories.Admin = {
        adminSide: function(){
            return new Tatami.Views.AdminSide();
        },

        adminBody: function(){
            return new Tatami.Views.AdminBody();
        }
    };

})(Backbone, _, Tatami);