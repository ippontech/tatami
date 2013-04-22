(function(window, Backbone, $, _){
    _.templateSettings = {
        interpolate: /<\@\=(.+?)\@\>/gim,
        evaluate: /<\@(.+?)\@\>/gim
    };

    var Tatami = {
        Models : {},
        Collections : {},
        Views : {},
        Factories : {}
    };

    Tatami.app = new Backbone.Marionette.Application();

    Tatami.app.addInitializer(function(){
        Tatami.app.user = new Tatami.Models.Users({
            username: username
        });

        Tatami.app.user.fetch();
    });

    Tatami.app.addInitializer(function(){
        var autoRefresh = function(){
            console.log('refresh');
            Tatami.app.trigger('refresh');
            _.delay(autoRefresh, 20000);
        };
        autoRefresh();
    });

    Tatami.app.addInitializer(function(){
        var $w = $(window);
        var $d = $(document);

        var autoNext = _.debounce(function(){
            if($w.height() + $d.scrollTop() > $d.height() - 200)
                Tatami.app.trigger('next');
        }, jQuery.fx.speeds._default);

        $(window).scroll(autoNext);
    });

    Tatami.app.addInitializer(function(){
        Tatami.app.addRegions({
            header: '#tatamiHeader',
            side: '#tatamiSide',
            body: '#tatamiBody'
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
})(window, Backbone, jQuery, _);