define([
	"../var/support"
], function( support ) {

(function() {
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	support.leadingWhitespace = div.firstChild.nodeType === 3;
	support.tbody = !div.getElementsByTagName( "tbody" ).length;
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}
	if (support.deleteExpando == null) {
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}
})();

return support;

});
