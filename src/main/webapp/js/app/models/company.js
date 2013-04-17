(function(Backbone, Tatami){

    var Company = Backbone.Model.extend({
        urlRoot: '/tatami/rest/company'
    });

    Tatami.Models.Company = Company;

})(Backbone, Tatami);