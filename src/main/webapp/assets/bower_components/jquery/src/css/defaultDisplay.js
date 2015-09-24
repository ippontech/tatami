define([
	"../core",
	"../manipulation" // appendTo
], function( jQuery ) {

var iframe,
	elemdisplay = {};
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?
			style.display : jQuery.css( elem[ 0 ], "display" );
	elem.detach();

	return display;
}

function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );
		if ( display === "none" || !display ) {
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

return defaultDisplay;
});
