(function( $ ){

  $.fn.infinitiScroll = function( options ) {  

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
      'action' : ''
    }, options);

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