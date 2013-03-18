(function($, _){

  $.fn.infinitiScroll = function( options ) {

    var cb = _.throttle(function(){
      if(self.offsetTop && self.offsetTop-$(window).height() <= $(window).scrollTop()) {
        self.click();
      }
    }, 500);

    return this.each(function() {
      var self = this;

      $(window).on('scroll', cb);
    });

  };
})( jQuery, _);