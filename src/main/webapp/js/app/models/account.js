(function(Backbone, Tatami){

    var Account = Backbone.Model.extend({
        idAttribute:'username',

        urlRoot: '/tatami/rest/account',

        default :{
            username:''
        }

    });

    Tatami.Models.Account = Account;

})(Backbone, Tatami);
