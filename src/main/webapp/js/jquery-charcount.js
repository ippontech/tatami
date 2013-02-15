/*
 * 	Character Count Plugin - jQuery plugin
 * 	Dynamic character count for text areas and input fields
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/7161/jquery-plugin-simplest-twitterlike-dynamic-character-count-for-textareas
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
(function($) {

	$.fn.charCount = function(options){
	  
		// default configuration properties
		var defaults = {	
			allowed: 140,		
			warning: 25,
			css: 'counter',
			counterElement: 'span',
			cssWarning: 'warning',
			cssExceeded: 'exceeded',
			counterText: ''
		}; 
			
		var options = $.extend(defaults, options); 
		
		function calculate(obj, counter){
			var count = $(obj).val().length;
			var available = options.allowed - count;
			if(available <= options.warning && available >= 0){
				counter.addClass(options.cssWarning);
			} else {
				counter.removeClass(options.cssWarning);
			}
			if(available < 0){
				counter.addClass(options.cssExceeded);
			} else {
				counter.removeClass(options.cssExceeded);
			}
			counter.html(options.counterText + available);
		};
				
		this.each(function() {  
			var $counter = $('<'+ options.counterElement +' class="' + options.css + '">'+ options.counterText +'</'+ options.counterElement +'>');			
			$(this).after($counter);
			calculate(this, $counter);
			$(this).keyup(function(){calculate(this, $counter)});
			$(this).change(function(){calculate(this, $counter)});
		});
	  
	};

})(jQuery);
