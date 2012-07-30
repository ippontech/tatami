(function( $ ){

  $.fn.infinitiScroll = function( options ) {  

    return this.each(function() {
      var self = this;
      $(window).on('scroll', function(){
        if(self.offsetTop && self.offsetTop-$(window).height() <= $(window).scrollTop()) {
          self.click();
        }
      });
    });

  };
})( jQuery );