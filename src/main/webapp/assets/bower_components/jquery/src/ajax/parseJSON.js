define([
	"../core"
], function( jQuery ) {

var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	if ( window.JSON && window.JSON.parse ) {
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {
		if ( requireNonComma && comma ) {
			depth = 0;
		}
		if ( depth === 0 ) {
			return token;
		}
		requireNonComma = open || comma;
		depth += !close - !open;
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};

return jQuery.parseJSON;

});
