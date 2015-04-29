define([
	"../../core",
	"../../selector"
], function( jQuery ) {

	return function( elem, el ) {
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};
});
