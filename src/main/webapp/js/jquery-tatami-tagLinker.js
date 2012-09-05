/**
* jQuery-tagLinker for Tatami
* (c) 2012 [Ippon Technologies](www.ippon.fr)
*
* by Arthur Weber
*/
(function($) {
  $.fn.tagLinker = function(selector) {
    this.find(selector).each(function(){
      var content = $(this).html();
      var matches = content.match(/#[a-zA-Z0-9]*/gi);
      if(matches) {
        $.each(matches, function(index, value){
          var tag = value.substr(1);
          var tagHTML = '<a href="/tatami/#/tags/'+tag+'">'+value+'</a>';
          content = content.replace(value, tagHTML);
        });
        $(this).html(content);
      }
    });
    return $(this);
  };
}(jQuery));