/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.SphericalMercator = {

        getExtent: function() {
        var extent = null;
        if (this.sphericalMercator) {
            extent = this.map.calculateBounds();
        } else {
            extent = OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this);
        }
        return extent;
    },

        getLonLatFromViewPortPx: function (viewPortPx) {
        return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this, arguments);
    },
    
        getViewPortPxFromLonLat: function (lonlat) {
        return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this, arguments);
    },

        initMercatorParameters: function() {
        this.RESOLUTIONS = [];
        var maxResolution = 156543.03390625;
        for(var zoom=0; zoom<=this.MAX_ZOOM_LEVEL; ++zoom) {
            this.RESOLUTIONS[zoom] = maxResolution / Math.pow(2, zoom);
        }
        this.units = "m";
        this.projection = this.projection || "EPSG:900913";
    },

        forwardMercator: (function() {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function(lon, lat) {
            var point = OpenLayers.Projection.transform({x: lon, y: lat}, gg, sm);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })(),

        inverseMercator: (function() {
        var gg = new OpenLayers.Projection("EPSG:4326");
        var sm = new OpenLayers.Projection("EPSG:900913");
        return function(x, y) {
            var point = OpenLayers.Projection.transform({x: x, y: y}, sm, gg);
            return new OpenLayers.LonLat(point.x, point.y);
        };
    })()

};
