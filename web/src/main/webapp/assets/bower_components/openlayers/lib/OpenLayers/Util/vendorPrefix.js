/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Util = OpenLayers.Util || {};
OpenLayers.Util.vendorPrefix = (function() {
    "use strict";
    
    var VENDOR_PREFIXES = ["", "O", "ms", "Moz", "Webkit"],
        divStyle = document.createElement("div").style,
        cssCache = {},
        jsCache = {};

    
        function domToCss(prefixedDom) {
        if (!prefixedDom) { return null; }
        return prefixedDom.
            replace(/([A-Z])/g, function(c) { return "-" + c.toLowerCase(); }).
            replace(/^ms-/, "-ms-");
    }

        function css(property) {
        if (cssCache[property] === undefined) {
            var domProperty = property.
                replace(/(-[\s\S])/g, function(c) { return c.charAt(1).toUpperCase(); });
            var prefixedDom = style(domProperty);
            cssCache[property] = domToCss(prefixedDom);
        }
        return cssCache[property];
    }

        function js(obj, property) {
        if (jsCache[property] === undefined) {
            var tmpProp,
                i = 0,
                l = VENDOR_PREFIXES.length,
                prefix,
                isStyleObj = (typeof obj.cssText !== "undefined");

            jsCache[property] = null;
            for(; i<l; i++) {
                prefix = VENDOR_PREFIXES[i];
                if(prefix) {
                    if (!isStyleObj) {
                        prefix = prefix.toLowerCase();
                    }
                    tmpProp = prefix + property.charAt(0).toUpperCase() + property.slice(1);
                } else {
                    tmpProp = property;
                }

                if(obj[tmpProp] !== undefined) {
                    jsCache[property] = tmpProp;
                    break;
                }
            }
        }
        return jsCache[property];
    }
    
        function style(property) {
        return js(divStyle, property);
    }
    
    return {
        css:      css,
        js:       js,
        style:    style,
        cssCache:       cssCache,
        jsCache:        jsCache
    };
}());