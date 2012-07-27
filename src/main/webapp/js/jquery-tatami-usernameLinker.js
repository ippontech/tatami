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
      $(this).html(content.replace(/@[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*/gi, function(value){
        var username = value.substr(1);
        var usernameHTML = '<a href="/tatami/profile/'+username+'/">'+value+'</a>';
        return usernameHTML;
      }));
    });
    return $(this);
  };
}(jQuery));