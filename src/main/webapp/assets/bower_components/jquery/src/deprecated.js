define([
	"./core",
	"./traversing"
], function( jQuery ) {
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

});
