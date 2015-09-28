define([
	"../core",
	"../core/parseHTML",
	"../ajax",
	"../traversing",
	"../manipulation",
	"../selector",
	"../event/alias"
], function( jQuery ) {
var _load = jQuery.fn.load;

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}
	if ( jQuery.isFunction( params ) ) {
		callback = params;
		params = undefined;
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {
			response = arguments;

			self.html( selector ?
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

});
