/**
* jQuery-usernameLinker for Tatami
* (c) 2012 [Ippon Technologies](www.ippon.fr)
* Released under the MIT license
* by Arthur Weber
*/
(function($) {
  $.fn.usernameLinker = function(selector) {
    this.find(selector).each(function(){
      var content = $(this).html();
      var matches = content.match(/@[^ ]*/gi);
      if(matches) {
        $.each(matches, function(index, value){
          var username = value.substr(1);
          var usernameHTML = '<a href="/tatami/profile/'+username+'/">'+value+'</a>';
          content = content.replace(value, usernameHTML);
        });
        $(this).html(content);
      }
    });
    return $(this);
  };
}(jQuery));