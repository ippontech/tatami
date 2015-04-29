define([
	"../core",
	"../var/strundefined"
], function( jQuery, strundefined ) {

var
	_jQuery = window.jQuery,
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}

});
