/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.XYZ = OpenLayers.Class(OpenLayers.Layer.Grid, {
    
        isBaseLayer: true,
    
        sphericalMercator: false,

        zoomOffset: 0,
    
        serverResolutions: null,

        initialize: function(name, url, options) {
        if (options && options.sphericalMercator || this.sphericalMercator) {
            options = OpenLayers.Util.extend({
                projection: "EPSG:900913",
                numZoomLevels: this.serverResolutions ?
                        this.serverResolutions.length : 19
            }, options);
        }
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            name || this.name, url || this.url, {}, options
        ]);
    },
    
        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.XYZ(this.name,
                                            this.url,
                                            this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },    

        getURL: function (bounds) {
        var xyz = this.getXYZ(bounds);
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            var s = '' + xyz.x + xyz.y + xyz.z;
            url = this.selectUrl(s, url);
        }
        
        return OpenLayers.String.format(url, xyz);
    },
    
        getXYZ: function(bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.tileOrigin.lon) /
            (res * this.tileSize.w));
        var y = Math.round((this.tileOrigin.lat - bounds.top) /
            (res * this.tileSize.h));
        var z = this.getServerZoom();

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
    
    /* APIMethod: setMap
     * When the layer is added to a map, then we can fetch our origin 
     *    (if we don't have one.) 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.maxExtent.left,
                                                this.maxExtent.top);
        }                                       
    },

    CLASS_NAME: "OpenLayers.Layer.XYZ"
});
