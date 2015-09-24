define([
	"./core",
	"./var/strundefined",
	"./var/support",
	"./core/init", // Needed for hasOwn support test
	"./core/ready"
], function( jQuery, strundefined, support ) {
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";
support.inlineBlockNeedsLayout = false;
jQuery(function() {
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {
		return;
	}
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
});

});
