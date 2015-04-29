define([
	"../var/support"
], function( support ) {

(function() {
	var input, div, select, a, opt;
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";
	support.getSetAttribute = div.className !== "t";
	support.style = /top/.test( a.getAttribute("style") );
	support.hrefNormalized = a.getAttribute("href") === "/a";
	support.checkOn = !!input.value;
	support.optSelected = opt.selected;
	support.enctype = !!document.createElement("form").enctype;
	select.disabled = true;
	support.optDisabled = !opt.disabled;
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
})();

return support;

});
