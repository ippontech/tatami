define([
	"../core",
	"./support",
	"../selector",
	"../css"
], function( jQuery, support ) {

jQuery.expr.filters.hidden = function( elem ) {
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};

});
