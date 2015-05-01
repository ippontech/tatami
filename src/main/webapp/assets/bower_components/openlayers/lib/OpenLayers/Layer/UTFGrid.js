/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.UTFGrid = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    
        isBaseLayer: false,
    
        projection: new OpenLayers.Projection("EPSG:900913"),

        useJSONP: false,
    
    
    
        tileClass: OpenLayers.Tile.UTFGrid,

        initialize: function(options) {
        OpenLayers.Layer.Grid.prototype.initialize.apply(
            this, [options.name, options.url, {}, options]
        );
        this.tileOptions = OpenLayers.Util.extend({
            utfgridResolution: this.utfgridResolution
        }, this.tileOptions);
    },

        createBackBuffer: function() {},
    
        clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.UTFGrid(this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },

        getFeatureInfo: function(location) {
        var info = null;
        var tileInfo = this.getTileData(location);
        if (tileInfo && tileInfo.tile) {
            info = tileInfo.tile.getFeatureInfo(tileInfo.i, tileInfo.j);
        }
        return info;
    },

        getFeatureId: function(location) {
        var id = null;
        var info = this.getTileData(location);
        if (info.tile) {
            id = info.tile.getFeatureId(info.i, info.j);
        }
        return id;
    },

    CLASS_NAME: "OpenLayers.Layer.UTFGrid"
});
