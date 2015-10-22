/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Projection = OpenLayers.Class({

        proj: null,
    
        projCode: null,
    
        titleRegEx: /\+title=[^\+]*/,

        initialize: function(projCode, options) {
        OpenLayers.Util.extend(this, options);
        this.projCode = projCode;
        if (typeof Proj4js == "object") {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    
        getCode: function() {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
   
        getUnits: function() {
        return this.proj ? this.proj.units : null;
    },

        toString: function() {
        return this.getCode();
    },

        equals: function(projection) {
        var p = projection, equals = false;
        if (p) {
            if (!(p instanceof OpenLayers.Projection)) {
                p = new OpenLayers.Projection(p);
            }
            if ((typeof Proj4js == "object") && this.proj.defData && p.proj.defData) {
                equals = this.proj.defData.replace(this.titleRegEx, "") ==
                    p.proj.defData.replace(this.titleRegEx, "");
            } else if (p.getCode) {
                var source = this.getCode(), target = p.getCode();
                equals = source == target ||
                    !!OpenLayers.Projection.transforms[source] &&
                    OpenLayers.Projection.transforms[source][target] ===
                        OpenLayers.Projection.nullTransform;
            }
        }
        return equals;   
    },

    /* Method: destroy
     * Destroy projection object.
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    },
    
    CLASS_NAME: "OpenLayers.Projection" 
});     

OpenLayers.Projection.transforms = {};

OpenLayers.Projection.defaults = {
    "EPSG:4326": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90],
        worldExtent: [-180, -90, 180, 90],
        yx: true
    },
    "CRS:84": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90],
        worldExtent: [-180, -90, 180, 90]
    },
    "EPSG:900913": {
        units: "m",
        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
        worldExtent: [-180, -89, 180, 89]
    }
};

OpenLayers.Projection.addTransform = function(from, to, method) {
    if (method === OpenLayers.Projection.nullTransform) {
        var defaults = OpenLayers.Projection.defaults[from];
        if (defaults && !OpenLayers.Projection.defaults[to]) {
            OpenLayers.Projection.defaults[to] = defaults;
        }
    }
    if(!OpenLayers.Projection.transforms[from]) {
        OpenLayers.Projection.transforms[from] = {};
    }
    OpenLayers.Projection.transforms[from][to] = method;
};

OpenLayers.Projection.transform = function(point, source, dest) {
    if (source && dest) {
        if (!(source instanceof OpenLayers.Projection)) {
            source = new OpenLayers.Projection(source);
        }
        if (!(dest instanceof OpenLayers.Projection)) {
            dest = new OpenLayers.Projection(dest);
        }
        if (source.proj && dest.proj) {
            point = Proj4js.transform(source.proj, dest.proj, point);
        } else {
            var sourceCode = source.getCode();
            var destCode = dest.getCode();
            var transforms = OpenLayers.Projection.transforms;
            if (transforms[sourceCode] && transforms[sourceCode][destCode]) {
                transforms[sourceCode][destCode](point);
            }
        }
    }
    return point;
};

OpenLayers.Projection.nullTransform = function(point) {
    return point;
};

(function() {

    var pole = 20037508.34;

    function inverseMercator(xy) {
        xy.x = 180 * xy.x / pole;
        xy.y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / pole) * Math.PI)) - Math.PI / 2);
        return xy;
    }

    function forwardMercator(xy) {
        xy.x = xy.x * pole / 180;
        var y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * pole;
        xy.y = Math.max(-20037508.34, Math.min(y, 20037508.34));
        return xy;
    }

    function map(base, codes) {
        var add = OpenLayers.Projection.addTransform;
        var same = OpenLayers.Projection.nullTransform;
        var i, len, code, other, j;
        for (i=0, len=codes.length; i<len; ++i) {
            code = codes[i];
            add(base, code, forwardMercator);
            add(code, base, inverseMercator);
            for (j=i+1; j<len; ++j) {
                other = codes[j];
                add(code, other, same);
                add(other, code, same);
            }
        }
    }
    var mercator = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100", "OSGEO:41001"],
        geographic = ["CRS:84", "urn:ogc:def:crs:EPSG:6.6:4326", "EPSG:4326"],
        i;
    for (i=mercator.length-1; i>=0; --i) {
        map(mercator[i], geographic);
    }
    for (i=geographic.length-1; i>=0; --i) {
        map(geographic[i], mercator);
    }

})();
