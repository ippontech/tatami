define([
	"../var/support"
], function( support ) {

(function() {
	var i, eventName,
		div = document.createElement( "div" );
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}
	div = null;
})();

return support;

});
