define([
	"../core",
	"../core/init",
	"../deferred"
], function( jQuery ) {
var readyList;

jQuery.fn.ready = function( fn ) {
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	isReady: false,
	readyWait: 1,
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},
	ready: function( wait ) {
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}
		jQuery.isReady = true;
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}
		readyList.resolveWith( document, [ jQuery ] );
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

function completed() {
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();
		if ( document.readyState === "complete" ) {
			setTimeout( jQuery.ready );
		} else if ( document.addEventListener ) {
			document.addEventListener( "DOMContentLoaded", completed, false );
			window.addEventListener( "load", completed, false );
		} else {
			document.attachEvent( "onreadystatechange", completed );
			window.attachEvent( "onload", completed );
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}
						detach();
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

});
