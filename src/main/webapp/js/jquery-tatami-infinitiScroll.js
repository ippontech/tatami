(function($, _){

  $.fn.infinitiScroll = function( options ) {

    return this.each(function() {
      var self = this;

      var cb = _.throttle(function(){
        if(self.offsetTop && self.offsetTop-$(window).height() < $(window).scrollTop()) {
          self.click();
        }
      }, 500);

      $(window).on('scroll', cb);

      _.delay(cb, 1000);
    });

  };
})( jQuery, _);