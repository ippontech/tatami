(function(window, Backbone, $){
    var Tatami = {
        Models : {},
        Collections : {},
        Views : {}
    };

    Tatami.app = new Backbone.Marionette.Application();

    Tatami.app.addInitializer(function(){
        Tatami.app.user = new Tatami.Models.Users({
            username: username
        });
    });

    Tatami.app.addInitializer(function(){
    });

    Tatami.app.addInitializer(function(){
        Tatami.app.addRegions({
            header: '#tatamiHeader'
        });
    });
    Tatami.app.on("initialize:after", function(options){
        if (Backbone.history){
            Tatami.app.router = new Tatami.Router();
            Backbone.history.start({
                pushState: true,
                root: "/tatami/new/"
            });
            if (Backbone.history._hasPushState) {
                $(document).delegate("a", "click", function(evt) {
                    var href = $(this).attr("href");
                    var protocol = this.protocol + "//";
                    debugger;
                    //if (href.slice(protocol.length) !== protocol && protocol !== 'javascript://' && href.substring(0, 1) !== '#') {
                    if (href.slice(protocol.length) !== protocol) {
                        evt.preventDefault();
                        Backbone.history.navigate(href, true);
                    }
                });
            }
        }
    });

    $(function(){
        Tatami.app.start();
    });

    window.Tatami = Tatami;
})(window, Backbone, jQuery);