(function(window, Backbone, $, _){
    _.templateSettings = {
        interpolate: /<\@\=(.+?)\@\>/gim,
        evaluate: /<\@(.+?)\@\>/gim
    };

    var show = Backbone.Marionette.Region.prototype.show;
    _.extend(Backbone.Marionette.Region.prototype, {
        show: function(view) {
            if (this.currentView !== view)
                show.apply(this, arguments);
        }
    });

    var Tatami = {
        Models : {},
        Collections : {},
        Views : {},
        Factories : {}
    };

    Tatami.app = new Backbone.Marionette.Application();

    Tatami.app.addInitializer(function(){
        var autoRefresh = function(){
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

    Tatami.app.addInitializer(function(){
        Tatami.app.edit = new Tatami.Views.StatusEdit({
            el: $('#tatamiEdit')
        });
    });

    Tatami.app.addInitializer(function(){
        Tatami.app.navbar = new Tatami.Views.Navbar({
            el: $('#navbar')
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
                    if (typeof href !== 'undefined' && href.slice(protocol.length) !== protocol && /^#.+$/.test(href)) {
                        evt.preventDefault();
                        Backbone.history.navigate(href, true);
                    }
                });
            }
        }
    });

    $(function(){
        var onStart = _.after(2, function(){
            Tatami.app.start();
        });

        Tatami.app.user = new Tatami.Models.Users({
            username: username
        });
        Tatami.app.groups = new Tatami.Collections.Groups();

        Tatami.app.user.fetch({
            success: onStart
        });
        Tatami.app.groups.fetch({
            success: onStart
        });
    });

    window.Tatami = Tatami;
})(window, Backbone, jQuery, _);