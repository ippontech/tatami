(function(Backbone, Tatami){

    var CFiles = Backbone.Collection.extend({
        model: Tatami.Models.File,
        url: '/tatami/rest/attachments'
    });

    Tatami.Collections.Files = CFiles;

})(Backbone, Tatami);