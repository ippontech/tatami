(function(Backbone, Tatami){

    var Users = Backbone.Collection.extend({
        model: Tatami.Models.Users
    });

    Tatami.Collections.Users = Users;

})(Backbone, Tatami);