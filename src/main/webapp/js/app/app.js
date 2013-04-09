(function(window, Backbone, $){
  var Tatami = {
    Models : {},
    Collections : {},
    Views : {},
    Sync : {}
  };

  Tatami.app = new Backbone.Marionette.Application();

  Tatami.app.addInitializer(function(){
    Tatami.app.user = new Tatami.Models.Users({
      username: username
    });
  });

  $(function(){
    Tatami.app.start();
  });

  window.Tatami = Tatami;
})(window, Backbone, jQuery);