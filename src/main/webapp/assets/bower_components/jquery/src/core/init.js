define([
	"../core",
	"./var/rsingleTag",
	"../traversing/findFilter"
], function( jQuery, rsingleTag ) {
var rootjQuery,
	document = window.document,
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;
		if ( !selector ) {
			return this;
		}
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}
			if ( match && (match[1] || !context) ) {
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;
				} else {
					elem = document.getElementById( match[2] );
					if ( elem && elem.parentNode ) {
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );
			} else {
				return this.constructor( context ).find( selector );
			}
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};
init.prototype = jQuery.fn;
rootjQuery = jQuery( document );

return init;

});
