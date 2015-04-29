/*! http://mths.be/smoothscroll v1.5.2 by @mathias */
;
(function(document, $) {

  var $scrollElement = (function() {
    var $html = $(document.documentElement),
      $body = $(document.body),
      bodyScrollTop;
    if ($html.scrollTop()) {
      return $html;
    } else {
      bodyScrollTop = $body.scrollTop();
      if ($body.scrollTop(bodyScrollTop + 1).scrollTop() == bodyScrollTop) {
        return $html;
      } else {
        return $body.scrollTop(bodyScrollTop);
      }
    }
  }());

  $.fn.smoothScroll = function(speed) {
    speed = ~~speed || 400;
    return this.find('a[href*="#"]').click(function(event) {
      var hash = this.hash,
        $hash = $(hash); // The in-document element the link points to
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        if ($hash.length) {
          event.preventDefault();
          $scrollElement.stop().animate({
            'scrollTop': $hash.offset().top
          }, speed, function() {
            location.hash = hash;
          });
        }
      }
    }).end();
  };

}(document, jQuery));