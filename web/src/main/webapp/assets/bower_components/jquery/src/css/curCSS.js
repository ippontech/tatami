define([
	"exports",
	"../core",
	"./var/rnumnonpx",
	"./var/rmargin",
	"../selector" // contains
], function( exports, jQuery, rnumnonpx, rmargin ) {

var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}

exports.getStyles = getStyles;
exports.curCSS = curCSS;

});
