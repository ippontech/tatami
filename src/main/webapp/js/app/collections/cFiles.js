(function(Backbone, Tatami){

    var CFiles = Backbone.Collection.extend({
        model: MFile,
        url: '/tatami/rest/attachments'
    });



    Tatami.Collections.Files = CFiles;

})(Backbone, Tatami);