define([
	"../core"
], function( jQuery ) {
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};

return jQuery.swap;

});
